import { DataTypes } from 'sequelize';
import { QueryInterfaceContext } from '../src/util/db/migrator-db';

module.exports = {
  up: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.addColumn('shows', 'data_updated_at', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('films', 'data_updated_at', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('seasons', 'data_updated_at', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.removeColumn('shows', 'data_updated_at');
    await queryInterface.removeColumn('films', 'data_updated_at');
    await queryInterface.removeColumn('seasons', 'data_updated_at');
  },
};
