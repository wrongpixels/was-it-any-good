import Person from './person';
import Film from './film';
import Show from './show';
import Season from './season';
import MediaRole from './mediaRole';
import { sequelize } from '../util/db';

Person.hasMany(MediaRole, {
  foreignKey: 'personId',
  as: 'roles',
});
MediaRole.belongsTo(Person, {
  foreignKey: 'personId',
  as: 'person',
});

Film.hasMany(MediaRole, {
  foreignKey: 'filmId',
  as: 'credits',
});
MediaRole.belongsTo(Film, {
  foreignKey: 'filmId',
  as: 'film',
});

Show.hasMany(MediaRole, {
  foreignKey: 'showId',
  as: 'credits',
});
MediaRole.belongsTo(Show, {
  foreignKey: 'showId',
  as: 'show',
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

export { Person, Film, Show, Season, MediaRole };
