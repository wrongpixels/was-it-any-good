import { DataTypes } from 'sequelize';
import { sequelize } from '../util/db';
import Media from './media';

class Season extends Media {
  declare id: number;
  declare showId: number;
  declare tmdbId: string;
  declare imdbId?: string;
  declare seasonNumber: number;
  declare episodeCount: number;
}

Season.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    showId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'shows',
        key: 'id',
      },
    },
    tmdbId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    imdbId: {
      type: DataTypes.STRING,
      unique: true,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    episodeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'season',
    underscored: true,
    timestamps: true,
  }
);

export default Season;
