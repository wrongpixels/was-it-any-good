import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../../util/db';
import { Media, Show } from '..';
import { MediaType } from '../../../../shared/types/media';

class Season extends Media<
  InferAttributes<Season>,
  InferCreationAttributes<Season>
> {
  declare showId: number;
  declare index: number;
  declare mediaType: MediaType.Season;
  declare episodeCount: number;

  static associate() {
    this.belongsTo(Show, {
      foreignKey: 'showId',
      as: 'show',
    });
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
      order: [['index', 'ASC']],
    },
  }
);
export type CreateSeason = Omit<InferAttributes<Season>, 'id'>;

export default Season;
