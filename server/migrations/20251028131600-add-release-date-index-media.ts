import { DataTypes } from 'sequelize';
import { QueryInterfaceContext } from '../src/util/db/migrator-db';

module.exports = {
  up: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.addColumn('index_media', 'release_date', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.removeColumn('index_media', 'release_date');
  },
};
