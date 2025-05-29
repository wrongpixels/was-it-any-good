import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';
import { AuthorType } from '../types/media/media-types';

class MediaRole extends Model {}

MediaRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    personId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'person',
        key: 'id',
      },
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(AuthorType)),
      allowNull: false,
    },
    characterName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'media-role',
    underscored: true,
  }
);
