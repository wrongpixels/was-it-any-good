import {
  CreateOptions,
  CreationOptional,
  DataTypes,
  DestroyOptions,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { IndexMediaData } from '../../../../shared/types/models';
import UserMediaList from './userMediaList';
import IndexMedia from '../media/indexMedia';
import { sequelize } from '../../util/db/initialize-db';
import { MAX_ITEMS_LIST_INDEX } from '../../../../shared/constants/user-media-list-constants';

class UserMediaListItem extends Model<
  InferAttributes<UserMediaListItem>,
  InferCreationAttributes<UserMediaListItem>
> {
  declare id: CreationOptional<number>;
  declare indexInList: number;
  declare userListId: number;
  declare userList?: UserMediaList;
  declare indexId: number;
  declare indexMedia?: IndexMediaData;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static associate() {
    this.belongsTo(UserMediaList, {
      foreignKey: 'userListId',
      as: 'userList',
    });
    this.belongsTo(IndexMedia, { foreignKey: 'indexId', as: 'indexMedia' });
  }

  static hooks() {
    return {
      //we increment or decrement the number of elements on creation and destroy
      afterCreate: async (
        item: UserMediaListItem,
        options: CreateOptions<UserMediaListItem>
      ) => {
        await UserMediaList.increment('itemCount', {
          transaction: options.transaction,
          where: {
            id: item.userListId,
          },
        });
      },
      afterDestroy: async (
        item: UserMediaListItem,
        options: DestroyOptions<UserMediaListItem>
      ) => {
        await UserMediaList.decrement('itemCount', {
          transaction: options.transaction,
          where: {
            id: item.userListId,
          },
        });
      },
    };
  }
}

UserMediaListItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    indexInList: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,

      validate: {
        min: 0,
        max: MAX_ITEMS_LIST_INDEX - 1, // so if MAX = 100, positions can only be 0–99.
        //we always control the max size via service logic, since sequelize associations
        //can't directly enforce a "max children" constraint
      },
    },
    userListId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    indexId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user_media_list_item',
    tableName: 'user_media_list_items',
    indexes: [
      {
        unique: true,
        fields: ['index_id', 'user_list_id'],
      },
      {
        unique: true,
        fields: ['user_list_id', 'index_in_list'],
      },
    ],
  }
);

export default UserMediaListItem;
