import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../../util/db/initialize-db';
import Rating from './rating';
import { Session } from '..';
import UserMediaList from './userMediaList';
import { RatingData } from '../../../../shared/types/models';
import { createDefaultUserLists } from '../../services/user-media-lists-service';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string | null;
  declare username: string;
  declare hash: string;
  declare email: string;
  declare pfp: string | null;
  declare lastActive: Date | null;
  declare isActive: boolean;
  declare isAdmin: boolean;
  declare userLists?: UserMediaList[];
  declare ratings?: RatingData[];

  static associate() {
    this.hasMany(Rating, {
      as: 'ratings',
      foreignKey: 'userId',
      constraints: false,
    });
    this.hasMany(UserMediaList, {
      as: 'userLists',
      foreignKey: 'userId',
      hooks: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    this.hasOne(Session);
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
      allowNull: true,
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
    hooks: {
      //we create the default lists on user creation
      async afterCreate(user: User, options) {
        await createDefaultUserLists(user.id, options.transaction || undefined);
      },
    },
  }
);

export default User;
