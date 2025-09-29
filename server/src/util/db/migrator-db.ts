import { SequelizeStorage, Umzug } from 'umzug';
import { PRODUCTION } from '../config';
import { sequelize } from './initialize-db';
import { QueryInterface } from 'sequelize';
let migrator: Umzug<QueryInterface> | null = null;

export type QueryInterfaceContext = { context: QueryInterface };

export const getMigrator = (): Umzug<QueryInterface> => {
  if (!migrator) {
    migrator = new Umzug({
      logger: console,
      migrations: {
        //we only compile ts in development, so look for js in production
        glob: PRODUCTION ? 'server/migrations/*.js' : 'server/migrations/*.ts',
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    });
  }
  return migrator;
};
