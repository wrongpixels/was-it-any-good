import { DataTypes, QueryTypes, Transaction } from 'sequelize';
import { QueryInterfaceContext } from '../src/util/db/migrator-db';

interface User {
  id: number;
}

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

//a snapshot of the defaults lists that get created for each new user
//we need to add them back to all existing users too, so we have to run
//the logic during the migration without accessing our app and ensuring
//our data structure will not change because our app's does
const DEF_USER_LISTS = [
  {
    name: 'Likes',
    description: 'My Liked Media',
    media_types: ['Show', 'Film'],
    locked_media_type: true,
    index_in_user_lists: 0,
    user_id: -1,
    auto_clean_items: true,
    private: false,
    can_be_modified: false,
    icon: 'like',
  },

  {
    name: 'Watchlist',
    description: 'What am I watching next?',
    media_types: ['Film', 'Show', 'Season'],
    locked_media_type: true,
    auto_clean_items: true,
    can_be_modified: false,
    private: false,
    index_in_user_lists: 1,
    user_id: -1,
    icon: 'watchlist',
  },

  {
    name: 'Favorite Films',
    description: 'My favorite Films',
    media_types: ['Film'],
    locked_media_type: true,
    index_in_user_lists: 2,
    user_id: -1,
    auto_clean_items: false,
    can_be_modified: false,
    private: false,
    icon: 'fav-film',
  },

  {
    name: 'Favorite TV Shows',
    description: 'My favorite TV Shows',
    media_types: ['Show'],
    locked_media_type: true,
    index_in_user_lists: 3,
    user_id: -1,
    auto_clean_items: false,
    can_be_modified: false,
    private: false,
    icon: 'fav-show',
  },
];

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
            auto_clean_items: {
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

        //and now, we have to add to all our existing users the default lists
        //every new user will have on creation.

        //first, we get the ids of all our existing users
        const users = await queryInterface.sequelize.query<User>(
          'SELECT id FROM users',
          {
            type: QueryTypes.SELECT,
            transaction,
          }
        );
        if (users.length > 0) {
          console.log(
            `Found ${users.length} users to create default lists for.`
          );
          //we store the time right now.
          const timeNow: Date = new Date();

          //for each user, we create a copy of our def lists with their id and the
          //current time, as sequelize would with timeStamps on, which we use
          const listsToInsert = users.flatMap((u: User) =>
            DEF_USER_LISTS.map((list) => ({
              ...list,
              user_id: u.id,
              created_at: timeNow,
              updated_at: timeNow,
            }))
          );
          //if we built lists and we have as many as users we have, we proceed to
          //bulk insert them in the db
          if (listsToInsert.length > 0) {
            await queryInterface.bulkInsert('user_media_lists', listsToInsert, {
              transaction,
            });
            console.log('Updated all Users with default User Media Lists');
          }
        } else {
          console.log(
            'No existing users found. Skipping default list creation.'
          );
        }
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
