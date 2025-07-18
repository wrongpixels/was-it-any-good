import {
  DataTypes,
  Includeable,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {
  FilmParental,
  ShowParental,
} from '../../types/parental/parental-types';
import { sequelize } from '../../util/db';

import { Film, Media, Season } from '..';
import { MediaType } from '../../../../shared/types/media';
import { MediaQueryValues } from '../../types/media/media-types';

class Show extends Media<InferAttributes<Show>, InferCreationAttributes<Show>> {
  declare mediaType: MediaType.Show;
  declare parentalGuide: keyof typeof FilmParental | null;
  declare lastAirDate: string | null;
  declare episodeCount: number;
  declare seasonCount: number;

  static async findBy(params: Omit<MediaQueryValues, 'mediaType'>) {
    const mediaType = MediaType.Show;
    const media: Show | Film | Season | null = await this.findMediaBy({
      ...params,
      mediaType,
    });
    if (media?.mediaType !== mediaType) {
      return null;
    }
    return media;
  }

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
    hooks: Show.hooks(),
    scopes: {
      withSeasons(include?: Includeable[]) {
        return {
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
            include,
          },
          order: [['seasons', 'index', 'ASC']],
        };
      },
      withCredits: Show.creditsScope(MediaType.Show),
    },
  }
);
export type ShowAttributes = InferAttributes<Show>;
export type CreateShow = Omit<ShowAttributes, 'id'>;

export default Show;
