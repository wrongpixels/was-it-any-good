import { DataTypes } from 'sequelize';
import { ShowParental } from '../types/parental/parental-types';
import { sequelize } from '../util/db';
import Media from './media';

class Show extends Media {
  declare tmdbId: string;
  declare imdbId?: string;
  declare parentalGuide: string;
  declare lastAirDate: Date;
  declare episodeCount: number;
  declare seasonCount: number;
}

Show.init(
  {
    tmdbId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    imdbId: {
      type: DataTypes.STRING,
      unique: true,
    },
    parentalGuide: {
      type: DataTypes.ENUM(...Object.values(ShowParental)),
      allowNull: true,
    },
    lastAirDate: {
      type: DataTypes.DATE,
    },
    episodeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    seasonCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'show',
    underscored: true,
  }
);

export default Show;
