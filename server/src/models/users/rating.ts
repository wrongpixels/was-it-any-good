import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Op,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { MediaType } from '../../../../shared/types/media';
import { sequelize } from '../../util/db';
import { Film, IndexMedia, Season, Show, User } from '..';
import { RatingStats } from '../../../../shared/types/models';
import { DEF_RATING_STATS } from '../../../../shared/constants/rating-constants';

class Rating extends Model<
  InferAttributes<Rating>,
  InferCreationAttributes<Rating>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare mediaType: MediaType;
  declare mediaId: number;
  declare showId?: number;
  declare indexId: number;
  declare userScore: number;
  //Fields for accessing the SQL results
  declare count?: number;
  declare total?: number;

  static associate() {
    this.belongsTo(IndexMedia, {
      as: 'indexMedia',
      foreignKey: 'indexId',
    });
    /*
    this.belongsTo(Film, {
      as: 'film',
      foreignKey: 'mediaId',
      scope: {
        media_type: MediaType.Film,
      },
      constraints: false,
    });

    this.belongsTo(Show, {
      as: 'show',
      foreignKey: 'mediaId',
      scope: {
        media_type: MediaType.Show,
      },
      constraints: false,
    });
    this.belongsTo(Season, {
      as: 'season',
      foreignKey: 'mediaId',
      scope: {
        media_type: MediaType.Season,
      },
      constraints: false,
    });*/
    this.belongsTo(User, {
      foreignKey: 'userId',
      constraints: false,
    });
    this.belongsTo(Show, {
      as: 'parentShow',
      foreignKey: 'showId',
      constraints: false,
    });
  }

  async getMediaByType(transaction: Transaction | undefined) {
    switch (this.mediaType) {
      case MediaType.Film:
        return await Film.findByPk(this.mediaId, { transaction });
      case MediaType.Show:
        return await Show.findByPk(this.mediaId, { transaction });
      case MediaType.Season:
        return await Season.findByPk(this.mediaId, { transaction });
      default:
        return null;
    }
  }

  async updateRating(
    countSelf: boolean = true,
    transaction?: Transaction
  ): Promise<RatingStats> {
    console.log('\n\n', 'Triggered', '\n\n');

    const media: Show | Film | Season | null =
      await this.getMediaByType(transaction);

    if (!media) {
      return DEF_RATING_STATS;
    }

    const where: WhereOptions = countSelf
      ? {
          mediaId: this.mediaId,
          mediaType: this.mediaType,
        }
      : {
          mediaId: this.mediaId,
          mediaType: this.mediaType,
          id: {
            [Op.ne]: this.id,
          },
        };

    //db-level count and addition
    const summary: Rating | null = await Rating.findOne({
      where,
      transaction,
      raw: true,
      attributes: [
        [sequelize.fn('SUM', sequelize.col('user_score')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
    });

    const total: number = Number(summary?.total ?? 0);
    const count: number = Number(summary?.count ?? 0);
    const rating =
      media.baseRating > 0 ? Number(media.baseRating) + total : total;
    const voteCount = media.baseRating > 0 ? 1 + count : count;

    //being different models, we update them separately to keep TS happy and avoid using 'as'
    if (this.mediaType === MediaType.Film && media instanceof Film) {
      await media.update(
        { rating: rating / voteCount, voteCount },
        { transaction }
      );
    } else if (this.mediaType === MediaType.Show && media instanceof Show) {
      await media.update(
        { rating: rating / voteCount, voteCount },
        { transaction }
      );
    } else if (this.mediaType === MediaType.Season && media instanceof Season) {
      await media.update(
        { rating: rating / voteCount, voteCount },
        { transaction }
      );
    }
    return {
      rating: media.rating,
      voteCount: media.voteCount,
    };
  }
}

Rating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    indexId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    mediaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    showId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mediaType: {
      type: DataTypes.ENUM(...Object.values(MediaType)),
      validate: {
        isIn: {
          args: [Object.values(MediaType)],
          msg: 'Must be a valid Media Type',
        },
      },
      allowNull: false,
    },
    userScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
  },

  {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'media_id', 'media_type'],
      },
    ],
    modelName: 'rating',
    underscored: true,
  }
);
export default Rating;
