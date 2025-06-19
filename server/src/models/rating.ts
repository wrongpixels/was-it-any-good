import { DataTypes, Model } from 'sequelize';
import { MediaType } from '../../../shared/types/media';
import { sequelize } from '../util/db';
import { Film, Show } from '.';

class Rating extends Model {
  declare id: number;
  declare userId: number;
  declare mediaType: MediaType;
  declare mediaId: number;
  declare userScore: number;

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
        model: 'user',
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
        fields: ['userId', 'mediaId', 'mediaType'],
      },
    ],
    modelName: 'rating',
    underscored: true,
  }
);
export default Rating;
