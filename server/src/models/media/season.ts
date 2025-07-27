import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../../util/db';
import { Film, Media, Rating, Show } from '..';
import { MediaType } from '../../../../shared/types/media';
import { MediaQueryValues } from '../../types/media/media-types';
import {
  RatingUpdateValues,
  RatingUpdateOptions,
} from '../../types/helper-types';

class Season extends Media<
  InferAttributes<Season>,
  InferCreationAttributes<Season>
> {
  declare showId: number;
  declare index: number;
  declare mediaType: MediaType.Season;
  declare episodeCount: number;

  static associate() {
    Season.hasMany(Rating, {
      foreignKey: 'mediaId',
      as: 'ratings',
      scope: {
        mediaType: MediaType.Season,
      },
      constraints: false,
    });
    Season.hasOne(Rating, {
      foreignKey: 'mediaId',
      as: 'userRating',
      scope: {
        mediaType: MediaType.Season,
      },
      constraints: false,
    });
    this.belongsTo(Show, {
      foreignKey: 'showId',
      as: 'show',
    });
  }
  static async refreshRating(
    values: RatingUpdateValues,
    options: RatingUpdateOptions
  ) {
    return await this.update(values, options);
  }

  static async findBy(params: Omit<MediaQueryValues, 'mediaType'>) {
    const mediaType = MediaType.Season;
    const media: Show | Film | Season | null = await this.findMediaBy({
      ...params,
      mediaType,
    });
    if (media?.mediaType !== mediaType) {
      return null;
    }
    return media;
  }
}

Season.init(
  {
    ...Media.baseInit(),
    showId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'shows',
        key: 'id',
      },
    },
    mediaType: {
      type: DataTypes.STRING,
      defaultValue: MediaType.Season,
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
    defaultScope: {
      order: [['index', 'DESC']],
    },
  }
);
export type CreateSeason = Omit<InferAttributes<Season>, 'id'>;

export default Season;
