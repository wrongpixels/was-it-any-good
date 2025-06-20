import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';
import Rating from './rating';

class User extends Model {
  declare id: number;
  declare name: string;
  declare username: string;
  declare hash: string;
  declare email: string;
  declare pfp: string | null;
  declare lastActive: Date | null;
  declare isActive: boolean;
  declare isAdmin: boolean;

  static associate() {
    this.hasMany(Rating, {
      as: 'ratings',
      foreignKey: 'userId',
      constraints: false,
    });
  }
}

User.init(
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pfp: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user',
  }
);

export default User;
