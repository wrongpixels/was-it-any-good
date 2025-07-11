import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  FilmParental,
  ShowParental,
} from '../../types/parental/parental-types';
import { sequelize } from '../../util/db';
import { MediaType } from '../../types/media/media-types';
import { Media, Season } from '..';

class Show extends Media<InferAttributes<Show>, InferCreationAttributes<Show>> {
  declare mediaType: MediaType.Show;
  declare parentalGuide: keyof typeof FilmParental | null;
  declare lastAirDate: string | null;
  declare episodeCount: number;
  declare seasonCount: number;

  static associate() {
    this.doAssociate(MediaType.Show);
    Show.hasMany(Season, {
      foreignKey: 'showId',
      as: 'seasons',
    });
  }
}

Show.init(
  {
    ...Media.baseInit(),
    mediaType: {
      type: DataTypes.STRING,
      defaultValue: MediaType.Show,
    },
    parentalGuide: {
      type: DataTypes.ENUM(...Object.values(ShowParental)),
      allowNull: true,
    },
    lastAirDate: {
      type: DataTypes.STRING,
      allowNull: true,
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

    scopes: {
      withSeasons: {
        include: {
          association: 'seasons',
          attributes: [
            'id',
            'index',
            'name',
            'originalName',
            'description',
            'image',
            'voteCount',
            'rating',
            'baseRating',
            'tmdbId',
            'imdbId',
            'showId',
            'releaseDate',
            'episodeCount',
            'mediaType',
            'updatedAt',
          ],
        },
        order: [['seasons', 'index', 'ASC']],
      },
      withCredits: Show.creditsScope(MediaType.Show),
    },
  }
);
export type ShowAttributes = InferAttributes<Show>;
export type CreateShow = Omit<ShowAttributes, 'id'>;

export default Show;
