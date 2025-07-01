import {
  CreateOptions,
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
import { Film, Show, User } from '..';

class Rating extends Model<
  InferAttributes<Rating>,
  InferCreationAttributes<Rating>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare mediaType: MediaType;
  declare mediaId: number;
  declare userScore: number;
  //Fields for accessing the SQL results
  declare count?: number;
  declare total?: number;

  static associate() {
    this.belongsTo(Film, {
      foreignKey: 'mediaId',
      scope: {
        mediaType: MediaType.Film,
      },
      constraints: false,
    });

    this.belongsTo(Show, {
      foreignKey: 'mediaId',
      scope: {
        mediaType: MediaType.Show,
      },
      constraints: false,
    });
    this.belongsTo(User, {
      foreignKey: 'userId',
      constraints: false,
    });
  }
  async updateRating(countSelf: boolean = true, transaction?: Transaction) {
    const media: Show | Film | null =
      this.mediaType === MediaType.Film
        ? await Film.findByPk(this.mediaId, { transaction })
        : await Show.findByPk(this.mediaId, { transaction });
    if (!media) {
      return;
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
    /*
    //classic count and addition
    const ratings: Rating[] = await Rating.findAll({
      where,
      transaction,
    });
    if (ratings.length > 0) {
      ratings.forEach((r: Rating) => {
        if (r) {
          rating += r.userScore;
          voteCount += 1;
        }
      });
    }    
    */

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

    const total = Number(summary?.total ?? 0);
    const count = Number(summary?.count ?? 0);

    const rating = media.baseRating > 0 ? media.baseRating + total : total;
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
    }
  }
}

Rating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
//hooks so media updates the cached 'rating' automatically
Rating.afterCreate(async (rating: Rating, options?: CreateOptions) => {
  await rating.updateRating(true, options?.transaction || undefined);
});

Rating.afterUpdate(async (rating: Rating, options?: CreateOptions) => {
  await rating.updateRating(true, options?.transaction || undefined);
});

Rating.beforeDestroy(async (rating: Rating, options?: CreateOptions) => {
  await rating.updateRating(false, options?.transaction || undefined);
});
export default Rating;
