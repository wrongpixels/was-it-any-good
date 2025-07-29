import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  FindOptions,
  Op,
  Transaction,
  Includeable,
  WhereOptions,
  ScopeOptions,
} from 'sequelize';
import {
  Film,
  Genre,
  IndexMedia,
  MediaGenre,
  MediaRole,
  Rating,
  Season,
  Show,
} from '..';
import { CountryCode, isCountryCode } from '../../../../shared/types/countries';
import { MediaType } from '../../../../shared/types/media';
import { AuthorType } from '../../../../shared/types/roles';
import { sequelize } from '../../util/db';
import { RatingStats } from '../../../../shared/types/models';
import { DEF_RATING_STATS } from '../../../../shared/constants/rating-constants';
import { upsertIndexMedia } from '../../services/index-media-service';
import { getYearNum } from '../../../../shared/helpers/format-helper';
import {
  MediaQueryValues,
  MediaQueryOptions,
} from '../../types/media/media-types';
import { getUserRatingInclude } from '../../constants/scope-attributes';
import CustomError from '../../util/customError';
import {
  RatingUpdateOptions,
  RatingUpdateValues,
} from '../../types/helper-types';

class Media<
  TAttributes extends InferAttributes<Media<TAttributes, TCreation>>,
  TCreation extends InferCreationAttributes<Media<TAttributes, TCreation>>
> extends Model<TAttributes, TCreation> {
  declare id: CreationOptional<number>;
  declare tmdbId: number;
  declare imdbId?: string;
  declare name: string;
  declare originalName: string;
  declare sortName: string;
  declare description: string;
  declare country: CountryCode[];
  declare mediaType: MediaType;
  declare status: string;
  declare releaseDate: string | null;
  declare image: string;
  //the cached average of all Rating entries linked to the media
  declare rating: number;
  //a default rating score taken from TMDB so media is not '0' or 'not voted'
  //counts as a single vote so user's ratings will weight in easier
  //if no one voted the media on TMDB, then it'll be considered actually 'not voted'
  declare baseRating: number;
  //the cached length of all Rating entries linked to the media entry
  declare voteCount: number;
  declare popularity: number;
  declare runtime: number | null;
  //For getting the Cast and Crew data
  declare getCredits: HasManyGetAssociationsMixin<MediaRole>;
  declare getCast: HasManyGetAssociationsMixin<MediaRole>;
  declare getCrew: HasManyGetAssociationsMixin<MediaRole>;
  //For getting the Genres
  declare getGenres: BelongsToManyGetAssociationsMixin<MediaGenre>;

  static baseInit() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tmdbId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      imdbId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sortName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.STRING,
      },
      releaseDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          isValidCountryArray(value: string[]) {
            if (!Array.isArray(value)) {
              throw new Error('Must be an array');
            }
            const invalidCountries = value.filter(
              (country) => !isCountryCode(country)
            );

            if (invalidCountries.length > 0) {
              throw new Error(
                `Invalid country codes found: ${invalidCountries.join(', ')}`
              );
            }
          },
        },
      },
      mediaType: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [Object.values(MediaType)],
            msg: 'Must be a valid Media Type',
          },
        },
      },

      image: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 1),
        defaultValue: 0,
      },
      baseRating: {
        type: DataTypes.DECIMAL(3, 1),
      },
      voteCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      popularity: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
      },
      runtime: {
        type: DataTypes.INTEGER,
      },
    };
  }

  //a bridge for shared associations between models extending Media
  //has to be called from the models so 'this' works properly

  static doAssociate(mediaType: MediaType) {
    this.belongsTo(IndexMedia, {
      foreignKey: 'indexId',
      as: 'indexMedia',
    });

    this.belongsToMany(Genre, {
      through: MediaGenre,
      foreignKey: 'mediaId',
      otherKey: 'genreId',
      as: 'genres',
      constraints: false,
    });

    this.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'cast',
      scope: {
        mediaType,
        role: AuthorType.Actor,
      },
      constraints: false,
    });

    this.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'crew',
      scope: {
        mediaType,
        role: { [Op.ne]: AuthorType.Actor },
      },
      constraints: false,
    });

    this.hasMany(Rating, {
      foreignKey: 'mediaId',
      as: 'ratings',
      scope: {
        mediaType,
      },
      constraints: false,
    });
    this.hasOne(Rating, {
      foreignKey: 'mediaId',
      as: 'userRating',
      scope: {
        mediaType,
      },
      constraints: false,
    });
  }
  //A SQL approach using queries instead of 2 sequelize calls.
  static async refreshRatings(
    mediaId: number,
    mediaType: MediaType,
    transaction?: Transaction
  ): Promise<RatingStats> {
    const model =
      mediaType === MediaType.Show
        ? Show
        : mediaType === MediaType.Film
        ? Film
        : Season;
    const ratingTableName: string = Rating.tableName;
    const mediaTableName: string = model.tableName;

    const totalSubqueryString: string = `(SELECT COALESCE(SUM(user_score), 0) FROM "${ratingTableName}" WHERE "media_id" = "${mediaTableName}"."id" AND "media_type" = '${mediaType}')`;
    const countSubqueryString: string = `(SELECT COUNT(id) FROM "${ratingTableName}" WHERE "media_id" = "${mediaTableName}"."id" AND "media_type" = '${mediaType}')`;

    const ratingExpressionString = `CASE WHEN "base_rating" > 0 THEN ("base_rating" + ${totalSubqueryString}) / (1 + ${countSubqueryString}) ELSE CASE WHEN (${countSubqueryString}) > 0 THEN (${totalSubqueryString}) / (${countSubqueryString}) ELSE 0 END END`;
    const voteCountExpressionString = `CASE WHEN "base_rating" > 0 THEN 1 + ${countSubqueryString} ELSE ${countSubqueryString} END`;

    const values: RatingUpdateValues = {
      rating: sequelize.literal(ratingExpressionString),
      voteCount: sequelize.literal(voteCountExpressionString),
    };
    const options: RatingUpdateOptions = {
      where: { id: mediaId, mediaType },
      returning: true,
      transaction,
    };

    const [affectedCount, [updatedMedia]] = await model.refreshRating(
      values,
      options
    );

    if (affectedCount === 0 || !updatedMedia) {
      return DEF_RATING_STATS;
    }

    return {
      rating: updatedMedia.rating,
      voteCount: updatedMedia.voteCount,
    };
  }

  //a shared function to get media entries by either internal id or tmdbId
  //scopes for credits and the active user rating are included if provided
  //if 'plain: true', it will convert to plain data before returning.

  static async findMediaBy(
    params: MediaQueryValues
  ): Promise<Film | Show | Season | null> {
    if (!params.mediaId) {
      throw new CustomError('A media ID must be provided', 400);
    }
    const { scopeOptions, findOptions } = this.buildMediaQueryOptions(params);
    const where: WhereOptions = params.isTmdbId
      ? { tmdbId: params.mediaId }
      : { id: params.mediaId };
    const combinedFindOptions: FindOptions = {
      ...findOptions,
      where,
    };
    console.log(combinedFindOptions);
    switch (params.mediaType) {
      case MediaType.Film:
        return await Film.scope(scopeOptions).findOne(combinedFindOptions);
      case MediaType.Show:
        return await Show.scope(scopeOptions).findOne(combinedFindOptions);
      case MediaType.Season:
        return await Season.scope(scopeOptions).findOne(combinedFindOptions);
      default:
        throw new CustomError(`Invalid media type: ${params.mediaType}`, 400);
    }
  }

  public async syncIndex(): Promise<void> {
    try {
      console.log('Trying to update');
      const indexMediaData = {
        tmdbId: this.tmdbId,
        mediaType: this.mediaType,
        mediaId: this.id,
        addedToMedia: true,
        country: this.country,
        name: this.name,
        image: this.image,
        rating: this.rating,
        baseRating: this.baseRating,
        year: getYearNum(this.releaseDate),
        voteCount: this.voteCount,
        popularity: this.popularity,
      };
      if (indexMediaData) {
        console.log('updating');

        await upsertIndexMedia(indexMediaData);
      }
    } catch (error) {
      console.error(`Failed to sync index for mediaId: ${this.id}`, error);
    }
  }

  static async removeIndex(indexId: number): Promise<void> {
    try {
      await IndexMedia.destroy({ where: { id: indexId } });
    } catch (error) {
      console.error(`Failed to destroy index for mediaId: ${indexId}`, error);
    }
  }

  static buildMediaQueryOptions({
    mediaType,
    activeUser,
    unscoped,
    transaction,
  }: MediaQueryValues): MediaQueryOptions {
    const include: Includeable[] = getUserRatingInclude(mediaType, activeUser);
    const scopeOptions: (string | ScopeOptions)[] = unscoped
      ? []
      : ['withCredits'];

    if (mediaType === MediaType.Show) {
      scopeOptions.push({
        method: [
          'withSeasons',
          getUserRatingInclude(MediaType.Season, activeUser),
        ],
      });
    }
    const findOptions: FindOptions = { include, transaction };
    return { findOptions, scopeOptions };
  }

  static hooks() {
    return {
      afterUpdate: async (media: Show | Film) => {
        await media.syncIndex();
      },
      afterDestroy: async (media: Show | Film) => {
        await Media.removeIndex(media.indexId);
      },
    };
  }

  //shared scope between Media models
  static creditsScope(mediaType: MediaType): FindOptions {
    return {
      order: [['cast', 'order', 'ASC']],
      include: [
        {
          association: 'cast',
          include: [
            {
              association: 'person',
              attributes: ['id', 'name', 'tmdbId', 'image'],
            },
          ],
          attributes: {
            exclude: [
              'role',
              'mediaId',
              'mediaType',
              'createdAt',
              'updatedAt',
              'personId',
            ],
          },
        },
        {
          association: 'crew',
          include: [
            {
              association: 'person',
              attributes: ['id', 'name', 'tmdbId', 'image'],
            },
          ],
          attributes: {
            exclude: [
              'mediaId',
              'mediaType',
              'createdAt',
              'updatedAt',
              'personId',
              'characterName',
              'order',
            ],
          },
        },
        {
          association: 'genres',
          attributes: ['id', 'name', 'tmdbId'],
          through: {
            attributes: [],
            where: { mediaType },
          },
        },
      ],
    };
  }
}

export default Media;

//OLD UPDATE RATINGS, USING SEQUELIZE
/*
  async doUpdateRatings(transaction?: Transaction): Promise<RatingStats> {
    const mediaId: number = this.id;
    const mediaType: MediaType = this.mediaType;
    // Get sum of all related ratings
    const summary: Rating | null = await Rating.findOne({
      where: { mediaId, mediaType },
      transaction,
      raw: true,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('user_score')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
    });

    // If no ratings exist yet, 0
    const total: number = Number(summary?.total ?? 0);
    const count: number = Number(summary?.count ?? 0);

    let finalRating: number;
    let finalVoteCount: number;

    if (this.baseRating > 0) {
      finalRating = (Number(this.baseRating) + total) / (1 + count);
      finalVoteCount = 1 + count;
    } else {
      finalRating = count > 0 ? total / count : 0;
      finalVoteCount = count;
    }

    this.rating = finalRating;
    this.voteCount = finalVoteCount;

    await this.save({ transaction });

    return {
      rating: finalRating,
      voteCount: finalVoteCount,
    };
  } */

/*
  static async updateRatingById(
    id: number,
    mediaType: MediaType,
    transaction?: Transaction
  ): Promise<RatingStats> {
    const media = await this.findMediaBy({
      mediaId: id,
      mediaType,
      unscoped: true,
    });

    if (!media) {
      return DEF_RATING_STATS;
    }

    return await media.doUpdateRatings(transaction);
  }*/
