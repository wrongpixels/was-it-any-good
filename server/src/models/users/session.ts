import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../util/db';
import { User } from '..';

class Session extends Model {
  declare id: number;
  declare userId: number;
  declare user?: User;
  declare username: string;
  declare token: string;
  declare expired: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate() {
    this.belongsTo(User);
  }
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    expired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'session',
    underscored: true,
  }
);

export default Session;
