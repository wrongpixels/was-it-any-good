import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
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

  async updateRating() {
    const media: Show | Film | null =
      this.mediaType === MediaType.Film
        ? await Film.findByPk(this.mediaId)
        : await Show.findByPk(this.mediaId);
    if (!media) {
      return;
    }
    const ratings: Rating[] = await Rating.findAll({
      where: {
        mediaId: this.mediaId,
        mediaType: this.mediaType,
      },
    });

    let rating: number = media.baseRating > 0 ? media.baseRating : 0;
    let voteCount: number = rating > 0 ? 1 : 0;

    if (ratings.length > 0) {
      ratings.forEach((r: Rating) => {
        if (r) {
          rating += r.userScore;
          voteCount += 1;
        }
      });
    }
    //being different models, we update them separately to keep TS happy and avoid using 'as'
    if (this.mediaType === MediaType.Film && media instanceof Film) {
      await media.update({ rating: rating / voteCount, voteCount });
    } else if (this.mediaType === MediaType.Show && media instanceof Show) {
      await media.update({ rating: rating / voteCount, voteCount });
    }
  }
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
export default Rating;
