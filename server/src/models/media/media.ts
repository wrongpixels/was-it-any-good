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
  Show,
} from '..';
import { CountryCode, isCountryCode } from '../../../../shared/types/countries';
import { MediaType } from '../../../../shared/types/media';
import { AuthorType } from '../../../../shared/types/roles';
import { sequelize } from '../../util/db';
import { RatingStats } from '../../../../shared/types/models';
import { DEF_RATING_STATS } from '../../../../shared/constants/rating-constants';
import { addIndexMedia } from '../../services/index-media-service';
import { getYearNum } from '../../../../shared/helpers/format-helper';
import { FindByValues } from '../../types/media/media-types';
import { getUserRatingInclude } from '../../constants/scope-attributes';
import CustomError from '../../util/customError';

class Media<
  TAttributes extends InferAttributes<Media<TAttributes, TCreation>>,
  TCreation extends InferCreationAttributes<Media<TAttributes, TCreation>>
> extends Model<TAttributes, TCreation> {
  declare id: CreationOptional<number>;
  declare indexId?: CreationOptional<number | null>;
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
  }
  //a shared function to get media entries by either internal id or tmdbId
  //scopes for credits and the active user rating are included if provided

  static async findBy({
    mediaId,
    mediaType,
    isTmdbId,
    unscoped,
    transaction,
    activeUser,
  }: FindByValues): Promise<Film | Show | null> {
    if (!mediaId) {
      throw new CustomError('A media ID must be provided', 400);
    }

    const where: WhereOptions = isTmdbId
      ? { tmdbId: mediaId }
      : { id: mediaId };

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
    const findOptions: FindOptions = { where, include, transaction };

    switch (mediaType) {
      case MediaType.Film:
        return Film.scope(scopeOptions).findOne(findOptions);
      case MediaType.Show:
        return Show.scope(scopeOptions).findOne(findOptions);
      default:
        throw new CustomError(`Invalid media type: ${mediaType}`, 400);
    }
  }

  static async updateRatingById(
    id: number,
    mediaType: MediaType,
    transaction?: Transaction
  ): Promise<RatingStats> {
    const media = await this.findBy({ mediaId: id, mediaType });

    if (!media) {
      return DEF_RATING_STATS;
    }

    return media.doUpdateRatings(transaction);
  }

  public async syncIndex(): Promise<void> {
    try {
      console.log('Trying to update');
      const indexMediaData = {
        tmdbId: this.tmdbId,
        mediaType: this.mediaType,
        mediaId: this.id,
        addedToMedia: true,
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

        await addIndexMedia(indexMediaData);
      }
    } catch (error) {
      console.error(`Failed to sync index for mediaId: ${this.id}`, error);
    }
  }

  static async removeIndex(mediaId: number): Promise<void> {
    try {
      await IndexMedia.destroy({ where: { mediaId } });
    } catch (error) {
      console.error(`Failed to destroy index for mediaId: ${mediaId}`, error);
    }
  }

  static hooks() {
    return {
      afterCreate: async (media: Show | Film) => {
        await media.syncIndex();
      },

      afterUpdate: async (media: Show | Film) => {
        await media.syncIndex();
      },
      afterDestroy: async (media: Show | Film) => {
        await Media.removeIndex(media.id);
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
