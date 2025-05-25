import Country from '../countries/countryTypes';
import {
  Author,
  Creator,
  Director,
  Individual,
  AuthorType,
  Writer,
  Studio,
  Actor,
  Image,
  Character,
  Cast,
  Direction,
  Studios,
  BirthDate,
  ReleaseDate,
} from './mediaTypes';

export const DEF_IMAGE_PERSON: Image = 'https://i.imgur.com/jMiceYX.png';
export const DEF_IMAGE_MEDIA: Image = 'https://i.imgur.com/EYiJVoX.png';

export const DEF_BIRTHDATE: BirthDate = {
  year: 0,
  isUnknown: true,
};
export const DEF_RELEASEDATE: ReleaseDate = {
  date: null,
  isUnknown: true,
};

export const DEF_INDIVIDUAL: Individual = {
  id: -1,
  name: 'Unknown',
  country: Country.UNKNOWN,
  image: DEF_IMAGE_PERSON,
};

export const DEF_CREATOR: Creator = {
  ...DEF_INDIVIDUAL,
};

export const DEF_AUTHOR: Author = {
  ...DEF_CREATOR,
  type: AuthorType.Unknown,
  birthDate: DEF_BIRTHDATE,
};

export const DEF_DIRECTOR: Director = {
  ...DEF_AUTHOR,
  type: AuthorType.Director,
  name: 'Unknown drector',
};

export const DEF_WRITER: Writer = {
  ...DEF_AUTHOR,
  type: AuthorType.Writer,
  name: 'Unknown writer',
};

export const DEF_STUDIO: Studio = {
  ...DEF_INDIVIDUAL,
  name: 'Unknown studio',
};

export const DEF_ACTOR: Actor = {
  ...DEF_AUTHOR,
  type: AuthorType.Actor,
  name: 'Unknown actor',
};

export const DEF_CHARACTER: Character = {
  ...DEF_INDIVIDUAL,
  actor: DEF_ACTOR,
};

export const DEF_CAST: Cast = [DEF_CHARACTER];
export const DEF_DIRECTION: Direction = [DEF_DIRECTOR];
export const DEF_STUDIOS: Studios = [DEF_STUDIO];

export const DEF_MEDIA;
