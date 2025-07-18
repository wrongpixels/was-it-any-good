import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../../util/db';
import { FilmParental } from '../../types/parental/parental-types';

import { Media } from '..';
import { MediaType } from '../../../../shared/types/media';

class Film extends Media<InferAttributes<Film>, InferCreationAttributes<Film>> {
  declare mediaType: MediaType.Film;
  declare parentalGuide: keyof typeof FilmParental | null;

  static associate() {
    this.doAssociate(MediaType.Film);
  }
}

Film.init(
  {
    ...Media.baseInit(),
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
    hooks: Film.hooks(),
    scopes: {
      withCredits: Film.creditsScope(MediaType.Film),
    },
  }
);
export type FilmAttributes = InferAttributes<Film>;
export type CreateFilm = Omit<FilmAttributes, 'id'>;

export default Film;
