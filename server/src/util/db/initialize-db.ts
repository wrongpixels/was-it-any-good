import { Sequelize } from 'sequelize';
import { POSTGRES_URI } from '../config';
import { MigrationMeta } from 'umzug';
import { getMigrator, MIGRATIONS_ENABLED } from './migrator-db';

const sequelize = new Sequelize(POSTGRES_URI, {
  logging: false,
  pool: {
    max: 15,
    min: 3,
    acquire: 4000,
    idle: 10000,
    evict: 1000,
  },
  dialectOptions: {
    statement_timeout: 10000,
    idle_in_transaction_session_timeout: 15000,
  },
});

const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Postgres DB');
    const pendingMigrations: MigrationMeta[] = await getMigrator().pending();
    if (!MIGRATIONS_ENABLED) {
      console.log('Migrations are currently disabled.');
    } else if (pendingMigrations.length > 0) {
      console.log(`Found ${pendingMigrations.length} pending Migrations!`);
      try {
        const migrations: MigrationMeta[] = await runMigrations();
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

const runMigrations = async () => await getMigrator().up();
const rollBackMigrations = async () => await getMigrator().down();

export {
  initializeDB,
  sequelize,
  runMigrations as applyMigrations,
  rollBackMigrations,
};
