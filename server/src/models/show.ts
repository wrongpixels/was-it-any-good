import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { FilmParental, ShowParental } from '../types/parental/parental-types';
import { sequelize } from '../util/db';
import Media from './media';

class Show extends Media<InferAttributes<Show>, InferCreationAttributes<Show>> {
  declare tmdbId: string;
  declare imdbId?: string;
  declare parentalGuide: keyof typeof FilmParental | null;
  declare lastAirDate: string;
  declare episodeCount: number;
  declare seasonCount: number;
}

Show.init(
  {
    ...Media.baseInit(),
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
      type: DataTypes.STRING,
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
    ...Media.initOptions(),
    sequelize,
    modelName: 'show',
    underscored: true,
    defaultScope: {
      include: {
        association: 'seasons',
        attributes: [
          'tmdbId',
          'imdbId',
          'index',
          'name',
          'originalName',
          'description',
          'image',
          'voteCount',
          'rating',
          'releaseDate',
          'episodeCount',
        ],
      },
    },
    scopes: {
      withoutSeasons: {
        include: [],
      },
    },
  }
);
export type CreateShow = Omit<InferAttributes<Show>, 'id'>;

export default Show;
