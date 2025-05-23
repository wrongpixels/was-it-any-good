import Media from './media';
import { sequelize } from '../util/db';

sequelize.sync({ force: true, logging: console.log });

export { Media };
