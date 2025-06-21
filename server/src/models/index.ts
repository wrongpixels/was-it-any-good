import Person from './people/person';
import Media from './media/media';
import Film from './media/film';
import Show from './media/show';
import Season from './media/season';
import Genre from './genres/genre';
import Rating from './users/rating';
import MediaGenre from './genres/mediaGenre';
import MediaRole from './people/mediaRole';
import User from './users/user';
import Session from './users/session';
import { sequelize } from '../util/db';

Person.hasMany(MediaRole, {
  foreignKey: 'personId',
  as: 'roles',
});
MediaRole.belongsTo(Person, {
  foreignKey: 'personId',
  as: 'person',
});

Film.associate();
Show.associate();
User.associate();
Session.associate();
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

export {
  Media,
  Person,
  Film,
  Show,
  Season,
  Genre,
  MediaRole,
  MediaGenre,
  Rating,
  User,
  Session,
};
