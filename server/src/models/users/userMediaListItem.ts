import {
  CreationOptional,
  DataTypes,
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

    hooks: {
      async afterCreate(item: UserMediaListItem, options) {
        const count = await UserMediaListItem.count({
          where: { userListId: item.userListId },
          transaction: options.transaction,
        });

        await UserMediaList.update(
          { itemCount: count },
          {
            where: { id: item.userListId },
            transaction: options.transaction,
          }
        );
      },

      //we recalculate the itemCount of the list and also fix the indexInList
      //of items affected by the deletion, or else our unique index will break!
      async afterDestroy(item: UserMediaListItem, options) {
        const { transaction } = options;

        //count remaining items in that list
        const count = await UserMediaListItem.count({
          where: { userListId: item.userListId },
          transaction,
        });

        //update itemCount in parallel with the reindex
        await Promise.all([
          UserMediaList.update(
            { itemCount: count },
            {
              where: { id: item.userListId },
              transaction,
            }
          ),

          //we use a query to move up the indices above the deleted entry
          UserMediaListItem.sequelize!.query(
            `
        BEGIN;

        WITH ordered AS (
          SELECT
            id,
            ROW_NUMBER() OVER (
              PARTITION BY user_list_id
              ORDER BY index_in_list
            ) - 1 AS new_index_in_list
          FROM user_media_list_items
          WHERE user_list_id = 2
        )
        UPDATE user_media_list_items AS u
        SET index_in_list = o.new_index_in_list + 100000
        FROM ordered AS o
        WHERE u.id = o.id;

        UPDATE user_media_list_items
        SET index_in_list = index_in_list - 100000
        WHERE user_list_id = 2;

        COMMIT;
      `,
            {
              replacements: { userListId: item.userListId },
              transaction,
            }
          ),
        ]);
      },
    },

    indexes: [
      {
        unique: true,
        fields: ['index_id', 'user_list_id'],
      },
      /* {
        unique: true,
        fields: ['user_list_id', 'index_in_list'],
      },*/
    ],
  }
);

export default UserMediaListItem;
