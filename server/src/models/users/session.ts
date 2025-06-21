import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../util/db';
import { User } from '..';

class Session extends Model {
  declare id: number;
  declare userId: number;
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
      references: {
        model: 'users',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING,
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
