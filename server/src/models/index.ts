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
import IndexMedia from './media/indexMedia';
//import { sequelize } from '../util/db/initialize-db';
import { PRODUCTION } from '../util/config';
import UserMediaList from './users/userMediaList';
import UserMediaListItem from './users/userMediaListItem';

Person.hasMany(MediaRole, {
  foreignKey: 'personId',
  as: 'roles',
});
MediaRole.belongsTo(Person, {
  foreignKey: 'personId',
  as: 'person',
});
MediaRole.associate();
Film.associate();
Show.associate();
User.associate();
Session.associate();
Rating.associate();
Season.associate();
IndexMedia.associate();
UserMediaList.associate();
UserMediaListItem.associate();
if (!PRODUCTION) {
  // sequelize.sync({ alter: false, force: false });
}

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
  IndexMedia,
  UserMediaList,
  UserMediaListItem,
};
