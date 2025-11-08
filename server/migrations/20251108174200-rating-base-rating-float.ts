import { DataTypes } from 'sequelize';
import { QueryInterfaceContext } from '../src/util/db/migrator-db';

module.exports = {
  up: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.changeColumn('index_media', 'rating', {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('index_media', 'base_rating', {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('shows', 'rating', {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('shows', 'base_rating', {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('films', 'rating', {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('films', 'base_rating', {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('seasons', 'rating', {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('seasons', 'base_rating', {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    });
  },

  down: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.changeColumn('index_media', 'rating', {
      type: DataTypes.DECIMAL(3, 1),
      defaultValue: 0,
    });
    await queryInterface.changeColumn('index_media', 'base_rating', {
      type: DataTypes.DECIMAL(3, 1),
    });
    await queryInterface.changeColumn('shows', 'rating', {
      type: DataTypes.DECIMAL(3, 1),
      defaultValue: 0,
    });
    await queryInterface.changeColumn('shows', 'base_rating', {
      type: DataTypes.DECIMAL(3, 1),
    });
    await queryInterface.changeColumn('films', 'rating', {
      type: DataTypes.DECIMAL(3, 1),
      defaultValue: 0,
    });
    await queryInterface.changeColumn('films', 'base_rating', {
      type: DataTypes.DECIMAL(3, 1),
    });
    await queryInterface.changeColumn('seasons', 'rating', {
      type: DataTypes.DECIMAL(3, 1),
      defaultValue: 0,
    });
    await queryInterface.changeColumn('seasons', 'base_rating', {
      type: DataTypes.DECIMAL(3, 1),
    });
  },
};
