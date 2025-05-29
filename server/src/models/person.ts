import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class Person extends Model {
  declare id: number;
  declare name: string;
  declare tmdbId?: string;
  declare gamedbId?: string;
  declare image: string;
  declare country?: string;
  declare birthDate?: Date;
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
    },
    gamedbId: {
      type: DataTypes.STRING,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    country: {
      type: DataTypes.STRING,
    },
    birthDate: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'person',
    underscored: true,
  }
);
