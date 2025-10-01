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
import { sequelize } from '../../util/db/initialize-db';

import { Film, Media, Season } from '..';
import { MediaType } from '../../../../shared/types/media';
import { MediaQueryValues } from '../../types/media/media-types';
import {
  RatingUpdateOptions,
  RatingUpdateValues,
} from '../../types/helper-types';
import { toPlain } from '../../util/model-helpers';
import { SeasonResponse, ShowResponse } from '../../../../shared/types/models';
import { reorderSeasons } from '../../../../shared/helpers/media-helper';

class Show extends Media<InferAttributes<Show>, InferCreationAttributes<Show>> {
  declare mediaType: MediaType.Show;
  declare parentalGuide: keyof typeof FilmParental | null;
  declare lastAirDate: string | null;
  declare episodeCount: number;
  declare seasonCount: number;
  declare seasons?: SeasonResponse[];

  static async findBy(
    params: Omit<MediaQueryValues, 'mediaType'>
  ): Promise<Show | ShowResponse | null> {
    const mediaType = MediaType.Show;
    const media: Show | Film | Season | null = await this.findMediaBy({
      ...params,
      mediaType,
    });
    if (media?.mediaType !== mediaType) {
      return null;
    }
    //If the show has seasons, we sort them by index post-fetch.
    //ordering within sequelize proved unreliable with `separate: true` +
    //nested scopes. faster fetch + manual sort was deemed the better trade-off.

    if (media.seasons) {
      media.seasons = reorderSeasons(media);
    }
    return params.plainData ? toPlain<Show>(media) : media;
  }
  static async refreshRating(
    values: RatingUpdateValues,
    options: RatingUpdateOptions
  ) {
    return await this.update(values, options);
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
            separate: true,
            association: 'seasons',
            required: false,
            attributes: [
              'id',
              'index',
              'indexId',
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
        };
      },
      withCredits: Show.creditsScope(MediaType.Show),
    },
  }
);
export type ShowAttributes = InferAttributes<Show>;
export type CreateShow = Omit<ShowAttributes, 'id'>;

export default Show;
