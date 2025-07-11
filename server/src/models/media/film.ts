import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../../util/db';
import { FilmParental } from '../../types/parental/parental-types';
import { MediaType } from '../../types/media/media-types';

import { Media } from '..';

class Film extends Media<InferAttributes<Film>, InferCreationAttributes<Film>> {
  declare tmdbId: number;
  declare imdbId?: string;
  declare mediaType: MediaType.Film;
  declare parentalGuide: keyof typeof FilmParental | null;

  static associate() {
    this.doAssociate(MediaType.Film);
  }
}

Film.init(
  {
    ...Media.baseInit(),
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    imdbId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    mediaType: {
      type: DataTypes.STRING,
      defaultValue: MediaType.Film,
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
    scopes: {
      withCredits: Film.creditsScope(MediaType.Film),
    },
  }
);
export type FilmAttributes = InferAttributes<Film>;
export type CreateFilm = Omit<FilmAttributes, 'id'>;

export default Film;
