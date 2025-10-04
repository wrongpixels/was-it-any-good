import { DataTypes, Transaction } from 'sequelize';
import { QueryInterfaceContext } from '../src/util/db/migrator-db';

const USER_MEDIA_LIST_ICONS: string[] = [
  'fav-film',
  'fav-show',
  'fav-multi',
  'film',
  'show',
  'season',
  'multi',
  'like',
  'watchlist',
  'other',
] as const;

module.exports = {
  up: async ({ context: queryInterface }: QueryInterfaceContext) => {
    //we wrap in a transaction
    await queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        //UserMediaList
        await queryInterface.createTable(
          'user_media_lists',
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
            auto_remove_items: {
              type: DataTypes.BOOLEAN,
              defaultValue: false,
            },
            can_be_modified: {
              type: DataTypes.BOOLEAN,
              defaultValue: true,
            },
            private: {
              type: DataTypes.BOOLEAN,
              defaultValue: false,
            },
            description: {
              type: DataTypes.STRING,
              allowNull: true,
              defaultValue: '',
            },
            index_in_user_lists: {
              type: DataTypes.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
            icon: {
              type: DataTypes.ENUM(...USER_MEDIA_LIST_ICONS),
              allowNull: false,
              defaultValue: 'multi',
            },
            user_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              unique: false,
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
              references: {
                model: 'users',
                key: 'id',
              },
            },
            media_types: {
              type: DataTypes.ARRAY(DataTypes.STRING),
              allowNull: false,
              defaultValue: ['Film', 'Show'],
            },
            locked_media_type: {
              type: DataTypes.BOOLEAN,
              defaultValue: false,
            },
            created_at: {
              type: DataTypes.DATE,
              defaultValue: DataTypes.NOW,
            },
            updated_at: {
              type: DataTypes.DATE,
              defaultValue: DataTypes.NOW,
            },
          },
          { transaction }
        );
        await queryInterface.addIndex('user_media_lists', {
          unique: true,
          fields: ['user_id', 'name'],
          transaction,
        });
        await queryInterface.addIndex('user_media_lists', {
          unique: true,
          fields: ['user_id', 'index_in_user_lists'],
          transaction,
        });

        //UserMediaListItem
        await queryInterface.createTable(
          'user_media_list_items',
          {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            index_in_list: {
              type: DataTypes.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
            user_list_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                model: 'user_media_lists',
                key: 'id',
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
            index_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                model: 'index_media',
                key: 'id',
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
            created_at: {
              type: DataTypes.DATE,
              defaultValue: DataTypes.NOW,
            },
            updated_at: {
              type: DataTypes.DATE,
              defaultValue: DataTypes.NOW,
            },
          },
          { transaction }
        );
        await queryInterface.addIndex('user_media_list_items', {
          unique: true,
          fields: ['index_id', 'user_list_id'],
          transaction,
        });
        await queryInterface.addIndex('user_media_list_items', {
          unique: true,
          fields: ['user_list_id', 'index_in_list'],
          transaction,
        });
      }
    );
  },

  down: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        await queryInterface.dropTable('user_media_list_items', {
          transaction,
        });
        await queryInterface.dropTable('user_media_lists', { transaction });
        //we clean the ENUM we created too
        await queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_user_media_lists_icon";',
          { transaction }
        );
      }
    );
  },
};
