import { SequelizeStorage, Umzug } from 'umzug';
import { PRODUCTION, PRODUCTION_MODE, ProductionMode } from '../config';
import { sequelize } from './initialize-db';
import { QueryInterface } from 'sequelize';
let migrator: Umzug<QueryInterface> | null = null;
export const MIGRATIONS_ENABLED: boolean = false;

export type QueryInterfaceContext = { context: QueryInterface };

export const getMigrator = (): Umzug<QueryInterface> => {
  if (!migrator) {
    migrator = new Umzug({
      logger: console,
      migrations: {
        //we use ts in development and js after building for production
        //the folder structure is different in local and deployment,
        //so we specify the 2 possible placements
        glob: !PRODUCTION
          ? 'server/migrations/*.ts'
          : PRODUCTION_MODE === ProductionMode.Deployment
            ? 'server/migrations/*.js'
            : 'server/dist/server/migrations/*.js',
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    });
  }
  return migrator;
};
