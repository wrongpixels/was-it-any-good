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
} from 'sequelize';
import { Film, Genre, MediaGenre, MediaRole, Rating, Season, Show } from '..';
import { CountryCode, isCountryCode } from '../../../../shared/types/countries';
import { MediaType } from '../../../../shared/types/media';
import { AuthorType } from '../../../../shared/types/roles';
import { sequelize } from '../../util/db';
import { RatingStats } from '../../../../shared/types/models';
import { DEF_RATING_STATS } from '../../../../shared/constants/rating-constants';

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
      runtime: {
        type: DataTypes.INTEGER,
      },
    };
  }
  //a bridge for shared associations between models extending Media
  //has to be called from the models so 'this' works properly

  static doAssociate(mediaType: MediaType) {
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

  static async findByType(
    id: number,
    mediaType: MediaType,
    transaction?: Transaction
  ) {
    switch (mediaType) {
      case MediaType.Season:
        return await Season.findByPk(id, { transaction });
      case MediaType.Show:
        return await Show.findByPk(id, { transaction });
      case MediaType.Film:
        return await Film.findByPk(id, { transaction });
      default:
        return null;
    }
  }

  static async updateRatingById(
    id: number,
    mediaType: MediaType,
    transaction?: Transaction
  ): Promise<RatingStats> {
    const media = await this.findByType(id, mediaType, transaction);

    if (!media) {
      return DEF_RATING_STATS;
    }

    return media.doUpdateRatings(transaction);
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
