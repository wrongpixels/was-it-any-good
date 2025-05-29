import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../util/db';
import { FilmParental } from '../types/parental/parental-types';
import Media from './media';

class Film extends Media<InferAttributes<Film>, InferCreationAttributes<Film>> {
  declare tmdbId: string;
  declare imdbId?: string;
  declare parentalGuide: keyof typeof FilmParental | null;
}

Film.init(
  {
    ...Media.baseInit(),
    tmdbId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    imdbId: {
      type: DataTypes.STRING,
      allowNull: true,
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
export type CreateFilm = Omit<InferAttributes<Film>, 'id'>;

export default Film;
