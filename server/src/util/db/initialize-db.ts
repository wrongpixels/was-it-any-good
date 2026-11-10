import fs from 'fs';
import path from 'path';
import tls from 'tls';
import { Sequelize } from 'sequelize';
import { MigrationMeta } from 'umzug';
import { POSTGRES_URI, PRODUCTION_MODE, ProductionMode } from '../config';
import { getMigrator, MIGRATIONS_ENABLED } from './migrator-db';

//the self-hosted postgres only speaks TLS, and only in real production.
//dev and local-production still use a local postgres with no TLS.
const postgresUsesTls: boolean = PRODUCTION_MODE === ProductionMode.Deployment;

const DEFAULT_PG_TLS_SERVERNAME = 'kevapaereo.ddns.net';
const POSTGRES_CA_FILENAME = 'ca.crt';

const resolvePostgresCaPath = (): string => {
  const candidates: string[] = [
    //beside this module after the build copies it there (the image keeps that layout)
    path.join(__dirname, POSTGRES_CA_FILENAME),
    //server/certs when running the ts sources (server/src/util/db)
    path.join(__dirname, '..', '..', '..', 'certs', POSTGRES_CA_FILENAME),
    //server/certs when running the un-flattened dist build
    path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'certs',
      POSTGRES_CA_FILENAME
    ),
  ];
  const found: string | undefined = candidates.find((candidate) =>
    fs.existsSync(candidate)
  );
  if (!found) {
    throw new Error(
      `Postgres CA certificate not found. Looked in: ${candidates.join(', ')}`
    );
  }
  return found;
};

//pg overwrites ssl.servername with the URI host when that host is a hostname,
//so the name check has to live here or PG_TLS_SERVERNAME would be ignored.
const postgresTlsServername: string =
  process.env.PG_TLS_SERVERNAME?.trim() || DEFAULT_PG_TLS_SERVERNAME;

const postgresSsl = postgresUsesTls
  ? {
      rejectUnauthorized: true,
      ca: fs.readFileSync(resolvePostgresCaPath(), 'utf8'),
      servername: postgresTlsServername,
      checkServerIdentity: (
        _host: string,
        cert: tls.PeerCertificate
      ): Error | undefined =>
        tls.checkServerIdentity(postgresTlsServername, cert),
    }
  : undefined;

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
    //statement_timeout: 10000,
    //idle_in_transaction_session_timeout: 15000,
    ...(postgresSsl ? { ssl: postgresSsl } : {}),
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
