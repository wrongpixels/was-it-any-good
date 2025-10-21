import { DataTypes } from 'sequelize';
import { QueryInterfaceContext } from '../src/util/db/migrator-db';

module.exports = {
  up: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.addColumn('user_media_lists', 'item_count', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.removeColumn('user_media_lists', 'item_count');
  },
};
