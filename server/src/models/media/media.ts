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
  WhereOptions,
  ScopeOptions,
  Includeable,
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
  UserMediaListItem,
} from '..';
import { CountryCode, isCountryCode } from '../../../../shared/types/countries';
import { MediaType } from '../../../../shared/types/media';
import { AuthorType } from '../../../../shared/types/roles';
import { sequelize } from '../../util/db/initialize-db';
import {
  RatingData,
  RatingStats,
  ShowResponse,
} from '../../../../shared/types/models';
import { DEF_RATING_STATS } from '../../../../shared/constants/rating-constants';
import {
  MediaQueryValues,
  MediaQueryOptions,
} from '../../types/media/media-types';
import { getActiveUserIncludeable } from '../../constants/scope-attributes';
import CustomError from '../../util/customError';
import {
  RatingUpdateOptions,
  RatingUpdateValues,
} from '../../types/helper-types';
import {
  calculateShowRating,
  getAnyMediaRating,
} from '../../../../shared/util/rating-average-calculator';
import { updateVotedMediaCache } from '../../util/redis-helpers';
import { toPlain } from '../../util/model-helpers';

class Media<
  TAttributes extends InferAttributes<Media<TAttributes, TCreation>>,
  TCreation extends InferCreationAttributes<Media<TAttributes, TCreation>>,
> extends Model<TAttributes, TCreation> {
  declare id: CreationOptional<number>;
  declare tmdbId: number;
  declare imdbId?: string;
  declare indexId: number;
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
  declare indexMedia?: IndexMedia;
  declare updatedAt?: Date;
  declare createdAt?: Date;

  static baseInit() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      indexId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      baseRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
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
    //association to return the active user rating
    //directly within the media
    this.hasOne(Rating, {
      foreignKey: 'mediaId',
      as: 'userRating',
      scope: {
        media_type: mediaType,
      },
      constraints: false,
    });
    //virtual association to find if the media is in user's watchlist
    this.hasOne(UserMediaListItem, {
      foreignKey: 'indexId',
      sourceKey: 'indexId',
      as: 'userWatchlist',
      constraints: false,
    });
  }

  //an SQL approach to calculate and update ratings using queries instead of 2 sequelize calls.
  //this counts every valid vote linked to the entry and calculates a new average
  //------
  //NOTE: The average calculated will have a max of 4 decimals, so we have to round to that
  //on our frontend when calculating optimistic new ratings. Weighted Show ratings (which include seasons ratings)
  //can go over 4 decimals, as those are calculated on the frontend, avoiding this logic and its limitation.
  static async refreshRatings(
    mediaData:
      | RatingData
      | {
          mediaId: number;
          mediaType: MediaType;
        },
    transaction?: Transaction
  ): Promise<RatingStats> {
    const { mediaType, mediaId } = mediaData;
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

    const ratingUpdateValues: RatingUpdateValues = {
      rating: sequelize.literal(ratingExpressionString),
      voteCount: sequelize.literal(voteCountExpressionString),
    };

    const options: RatingUpdateOptions = {
      where: { id: mediaId, mediaType },
      returning: true,
      transaction,
    };

    //the actual call to update the entry's 'rating' and 'totalVotes' after the calculation
    const [affectedCount, [updatedMedia]] = await model.refreshRating(
      ratingUpdateValues,
      options
    );
    if (affectedCount === 0 || !updatedMedia) {
      return DEF_RATING_STATS;
    }
    //we also sync the cached Redis entry if we passed a RatingData object
    'userId' in mediaData &&
      updateVotedMediaCache(
        {
          rating: updatedMedia.rating,
          voteCount: updatedMedia.voteCount,
        },
        mediaData,
        updatedMedia.mediaType === MediaType.Season
          ? updatedMedia.showId
          : undefined
      );

    //we need to sync the linked indexMedia after each vote/unvote.
    //searches and rankings read from indexMedia as a cached snapshot of the
    //current average rating, so we don’t have to pull full Film/Show model entries
    //or make the client do extra work.

    //if it’s a Film, we simply sync its indexMedia rating and totalVotes.
    if (updatedMedia instanceof Film) {
      await updatedMedia.syncIndex(transaction);
    }

    //for Show or Season, we need to calculate again because indexMedia holds a Show’s real
    //display average (Show rating + its Seasons). each entry (Show/Season) keeps track of its own
    //rating and totalVotes, so we store this cached display average in the indexMedia, ready to read
    //in the client without needing to fetch Seasons or doing calculations.

    if (updatedMedia instanceof Show) {
      await updatedMedia.reload({
        attributes: ['rating', 'baseRating', 'voteCount', 'indexId'],

        include: [
          {
            association: 'seasons',
            attributes: ['rating', 'baseRating', 'voteCount'],
          },
        ],
        transaction,
      });
      await updatedMedia.syncIndex(transaction);
    }
    //for a Season vote, we need to fetch its parent Show and update its indexMedia, as voting
    //a Season affects the weighted average of te Show
    if (updatedMedia instanceof Season) {
      const parentShow: Show | null = await Show.findByPk(updatedMedia.showId, {
        attributes: ['rating', 'baseRating', 'voteCount', 'indexId'],
        transaction,
        include: [
          {
            association: 'seasons',
            attributes: ['rating', 'baseRating', 'voteCount'],
          },
        ],
      });
      if (parentShow) {
        parentShow.syncIndex(transaction);
      }
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
    //we need to do it like this or TS complains about typing.
    //we update the baseRating before returning, as the linked indexMedia entry
    //may have been updated in searches or trending pages
    switch (params.mediaType) {
      case MediaType.Film: {
        const entry =
          await Film.scope(scopeOptions).findOne(combinedFindOptions);
        await entry?.updateBaseRating();
        return entry;
      }
      case MediaType.Show: {
        const entry =
          await Show.scope(scopeOptions).findOne(combinedFindOptions);
        await entry?.updateBaseRating();
        return entry;
      }
      case MediaType.Season: {
        const entry =
          await Season.scope(scopeOptions).findOne(combinedFindOptions);
        await entry?.updateBaseRating();
        return entry;
      }
      default:
        throw new CustomError(`Invalid media type: ${params.mediaType}`, 400);
    }
  }

  public isShow(): this is Show {
    return this.mediaType === MediaType.Show;
  }

  //we update the baseRating if it has changed in the indexMedia nested, and we also
  //add the voteCount 1 if it was a media with no rating at all.
  //in the next user vote, the fresh baseRating will be used for the average
  public async updateBaseRating() {
    if (
      this.indexMedia &&
      this.indexMedia.baseRating > 0 &&
      this.indexMedia.baseRating !== this.baseRating &&
      (this.voteCount === 0 || (this.voteCount === 1 && this.baseRating))
    ) {
      const updateVoteCount = this.voteCount === 0;
      const initialBaseRating: number = this.baseRating;

      const updatedValues: Partial<TAttributes> = {
        baseRating: this.indexMedia.baseRating,
        rating: this.indexMedia.baseRating,
      } as unknown as Partial<TAttributes>;

      //if it's a show, we now recalculate the cached IndexMedia rating, which uses
      //the ratings of both the show itself and each season's
      if (this.isShow()) {
        //we mock how our updated show will look like after the update
        const newShowEntry: ShowResponse = {
          ...toPlain(this),
          ...updatedValues,
        };
        //we recalculate the show weighted average now (the entry has populated seasons)
        const average: number = getAnyMediaRating(newShowEntry);
        console.log(
          'New show average is:',
          average,
          'Used to be:',
          this.indexMedia.rating
        );
      }

      if (updateVoteCount) {
        updatedValues.voteCount = 1;
      }
      await this.update(updatedValues);
      console.log(
        `Updated baseRating of ${this.name} from`,
        initialBaseRating,
        'to its indexMedia',
        this.baseRating
      );
      if (updateVoteCount) {
        console.log(
          `${this.name} now has a valid base vote of`,
          this.baseRating
        );
      }
    }
  }
  public async syncIndex(transaction?: Transaction): Promise<void> {
    try {
      const rating =
        this instanceof Show && !!this.seasons
          ? calculateShowRating(this)
          : this.rating;
      console.log(rating);
      await IndexMedia.update(
        {
          rating,
          voteCount: this.voteCount,
        },
        {
          where: {
            id: this.indexId,
          },
          transaction,
        }
      );
      console.log('updated!', rating);
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
    const include: Includeable[] = getActiveUserIncludeable(
      mediaType,
      activeUser
    );
    const scopeOptions: (string | ScopeOptions)[] = unscoped
      ? []
      : ['withCredits'];

    if (mediaType === MediaType.Show) {
      scopeOptions.push({
        method: [
          'withSeasons',
          getActiveUserIncludeable(MediaType.Season, activeUser),
        ],
      });
    }

    const findOptions: FindOptions = {
      include,
      transaction,
    };
    return { findOptions, scopeOptions };
  }

  static hooks() {
    return {
      afterUpdate: async (media: Show | Film) => {
        const changed = media.changed();
        //if our rating or voteCount has changed, we sync the indexMedia
        if (
          changed &&
          (changed.includes('rating') || changed.includes('voteCount'))
        ) {
          console.log('Media rating or voteCount changed, syncing index.');
          await media.syncIndex();
        }
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
          attributes: ['id', 'characterName', 'order'],
        },
        {
          association: 'crew',
          where: {
            role: {
              //currently, we just care about direct creators
              [Op.in]: [
                AuthorType.Creator,
                AuthorType.Director,
                AuthorType.Writer,
              ],
            },
          },
          separate: true,
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
        {
          association: 'indexMedia',
          attributes: ['rating', 'updatedAt', 'baseRating', 'voteCount'],
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
