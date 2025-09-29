import { SequelizeStorage, Umzug } from 'umzug';
import { PRODUCTION } from '../config';
import { sequelize } from './initialize-db';

export const migrator = new Umzug({
  logger: console,
  migrations: {
    //we only compile ts in development, so look for js in production
    glob: PRODUCTION ? 'migrations/*.ts' : 'migrations/*.js',
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
});
