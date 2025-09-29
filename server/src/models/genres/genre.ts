import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../../util/db/initialize-db';

class Genre extends Model<
  InferAttributes<Genre>,
  InferCreationAttributes<Genre>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare tmdbId?: number;
  declare gamedbId?: number;
}

Genre.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    tmdbId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: true,
    },
    gamedbId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'genre',
  }
);
export type GenreAttributes = InferAttributes<Genre>;
export type CreateGenre = Omit<GenreAttributes, 'id'>;

export default Genre;
