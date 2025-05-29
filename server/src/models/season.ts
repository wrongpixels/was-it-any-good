import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../util/db';
import Media from './media';

class Season extends Media<
  InferAttributes<Season>,
  InferCreationAttributes<Season>
> {
  declare showId: number;
  declare tmdbId: string;
  declare imdbId?: string;
  declare index: number;
  declare episodeCount: number;
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
    tmdbId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    imdbId: {
      type: DataTypes.STRING,
      unique: true,
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
  }
);
export type CreateSeason = InferAttributes<Season>;

export default Season;
