import Person from './person';
import Media from './media';
import Film from './film';
import Show from './show';
import Season from './season';
import Genre from './genre';
import MediaGenre from './mediaGenre';
import MediaRole from './mediaRole';
import { sequelize } from '../util/db';
import { MediaType } from '../types/media/media-types';

Person.hasMany(MediaRole, {
  foreignKey: 'personId',
  as: 'roles',
});
MediaRole.belongsTo(Person, {
  foreignKey: 'personId',
  as: 'person',
});

Show.hasMany(Season, {
  foreignKey: 'showId',
  as: 'seasons',
});
Season.belongsTo(Show, {
  foreignKey: 'showId',
  as: 'show',
});

sequelize.sync({ force: true });

export { Person, Film, Show, Season, Genre, MediaRole, MediaGenre };
