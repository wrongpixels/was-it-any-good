import { DataTypes } from 'sequelize';
import { QueryInterfaceContext } from '../src/util/db/migrator-db';

module.exports = {
  up: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.addColumn('people', 'added_details', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('people', 'birth_place', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('people', 'death_date', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('people', 'description', {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.removeColumn('people', 'added_details');
    await queryInterface.removeColumn('people', 'birth_place');
    await queryInterface.removeColumn('people', 'death_date');
    await queryInterface.removeColumn('people', 'description');
  },
};
