import { DataTypes } from 'sequelize';
import { QueryInterfaceContext } from '../src/util/db/migrator-db';

module.exports = {
  up: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.addColumn('user_reviews', 'rating_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ratings',
        key: 'id',
      },
      onDelete: 'SET NULL',
    });
  },

  down: async ({ context: queryInterface }: QueryInterfaceContext) => {
    await queryInterface.removeColumn('user_reviews', 'rating_id');
  },
};
