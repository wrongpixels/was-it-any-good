import { DataTypes } from 'sequelize';
import Media from './media';
import { FilmParental } from '../types/parental/parental-types';
import { sequelize } from '../util/db';

class Film extends Media {}

Film.init(
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
      type: DataTypes.ENUM(...Object.values(FilmParental)),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'film',
    underscored: true,
  }
);

export default Film;
