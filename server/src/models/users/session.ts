import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../../util/db';
import { User } from '..';
import { isDateExpired } from '../../../../shared/helpers/auth-helper';

class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare user?: User;
  declare username: string;
  declare token: string;
  declare expired: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static associate(): void {
    this.belongsTo(User);
  }

  //10 days limit
  isExpired(): boolean {
    if (this.expired || this.token === '' || isDateExpired(this.createdAt)) {
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
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
