import Person from './person';
import Film from './film';
import Show from './show';
import Season from './season';
import Genre from './genre';
import Rating from './rating';
import MediaGenre from './mediaGenre';
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

//Common Media<->MediaRole and Genre<->MediaGenre associations
Film.associate();
Show.associate();
Rating.associate();

Show.hasMany(Season, {
  foreignKey: 'showId',
  as: 'seasons',
});
Season.belongsTo(Show, {
  foreignKey: 'showId',
  as: 'show',
});

sequelize.sync({ force: false });

export { Person, Film, Show, Season, Genre, MediaRole, MediaGenre, Rating };
