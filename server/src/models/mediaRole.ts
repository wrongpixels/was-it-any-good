import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';
import { AuthorType } from '../types/media/media-types';

class MediaRole extends Model<
  InferAttributes<MediaRole>,
  InferCreationAttributes<MediaRole>
> {
  declare id: CreationOptional<number>;
  declare personId: number;
  declare filmId?: number;
  declare showId?: number;
  declare role: string;
  declare characterName?: string[];
  declare order?: number;
}

MediaRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    personId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'people',
        key: 'id',
      },
      allowNull: false,
    },
    filmId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'films',
        key: 'id',
      },
      defaultValue: null,
    },
    showId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'shows',
        key: 'id',
      },
      defaultValue: null,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(AuthorType)),
      allowNull: false,
    },
    characterName: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'mediaRole',
    tableName: 'media_roles',
    underscored: true,
  }
);
export type CreateMediaRole = Omit<InferAttributes<MediaRole>, 'id'>;

export default MediaRole;
