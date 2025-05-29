import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class Person extends Model {}

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
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
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

export default Person;
