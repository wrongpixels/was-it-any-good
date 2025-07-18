import { Sequelize } from 'sequelize';
import { POSTGRES_URI } from './config';
//import { Umzug, SequelizeStorage } from 'umzug';

const sequelize = new Sequelize(POSTGRES_URI, { logging: false });

const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Postgres DB');
  } catch (error) {
    console.error('Connection to Postgres failed:', error);
    throw error;
  }
};

export { initializeDB, sequelize };
