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

  static associate(): void {
    this.belongsTo(User);
  }

  //10 days limit
  isExpired(): boolean {
    const currentDate: Date = new Date();
    if (
      this.expired ||
      this.token === '' ||
      currentDate.getTime() - this.createdAt.getTime() > 864000000
    ) {
      return true;
    }
    return false;
  }

  async expire(): Promise<void> {
    if (!this.expired) {
      this.expired = true;
      await this.save();
    }
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
