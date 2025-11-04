import { DataTypes, Transaction } from 'sequelize';
import { QueryInterfaceContext } from '../src/util/db/migrator-db';

module.exports = {
  up: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        await queryInterface.addColumn(
          'people',
          'gender',
          {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          { transaction }
        );
        await queryInterface.bulkUpdate(
          'people',
          {
            added_details: false,
          },
          //to update all
          {},
          {
            transaction,
          }
        );
      }
    );
  },

  down: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.removeColumn('people', 'gender');
  },
};
