import { Sequelize } from 'sequelize';
import { POSTGRES_URI } from '../config';
import { MigrationMeta } from 'umzug';
import { getMigrator } from './migrator-db';

const sequelize = new Sequelize(POSTGRES_URI, { logging: false });

const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Postgres DB');
    const pendingMigrations: MigrationMeta[] = await getMigrator().pending();
    if (pendingMigrations.length > 0) {
      console.log(`Found ${pendingMigrations.length} pending Migrations!`);
      try {
        const migrations: MigrationMeta[] = await applyMigrations();
        console.log('Migrations applied:', {
          files: migrations.map((m: MigrationMeta) => m.name),
        });
        //if something failed, we report the error for future rollbacks.
      } catch (error) {
        console.log('Migration error:', error);
        throw error;
      }
    } else {
      console.log('No pending migrations!');
    }
  } catch (error) {
    console.error('Connection to Postgres failed:', error);
    throw error;
  }
};

const applyMigrations = async () => await getMigrator().up();
const rollBackMigrations = async () => await getMigrator().down();

export { initializeDB, sequelize, applyMigrations, rollBackMigrations };
