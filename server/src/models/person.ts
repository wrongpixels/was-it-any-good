import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';

class Person extends Model<
  InferAttributes<Person>,
  InferCreationAttributes<Person>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare tmdbId?: string;
  declare gamedbId?: string;
  declare image: string;
  declare birthDate?: string;
  declare country: string[];
}

Person.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tmdbId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    gamedbId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'person',
    underscored: true,
  }
);
export type PersonAttributes = InferAttributes<Person>;
export type CreatePerson = Omit<PersonAttributes, 'id'>;

export default Person;
