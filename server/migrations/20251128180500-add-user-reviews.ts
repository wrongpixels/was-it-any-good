import { DataTypes, Transaction } from 'sequelize';
import { QueryInterfaceContext } from '../src/util/db/migrator-db';

module.exports = {
  up: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        await queryInterface.createTable(
          'user_reviews',
          {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
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
            user_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                model: 'users',
                key: 'id',
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
            seasons: {
              type: DataTypes.ARRAY(DataTypes.INTEGER),
              allowNull: false,
              defaultValue: [],
            },
            title: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            main_content: {
              type: DataTypes.TEXT,
              allowNull: false,
            },
            spoiler_content: {
              type: DataTypes.TEXT,
              allowNull: true,
            },
            recommended: {
              type: DataTypes.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
            edited: {
              type: DataTypes.BOOLEAN,
              allowNull: false,
              defaultValue: false,
            },
            times_edited: {
              type: DataTypes.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
            last_edited: {
              type: DataTypes.DATE,
              allowNull: true,
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

        await queryInterface.addIndex('user_reviews', {
          unique: true,
          fields: ['user_id', 'index_id'],
          transaction,
        });
      }
    );
  },

  down: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        await queryInterface.dropTable('user_reviews', { transaction });
      }
    );
  },
};
