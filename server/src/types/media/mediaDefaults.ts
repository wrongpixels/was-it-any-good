import Country from '../countryTypes';
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
} from './mediaTypes';

export const DEF_IMAGE_PERSON: Image = 'https://i.imgur.com/jMiceYX.png';
export const DEF_IMAGE_MEDIA: Image = 'https://i.imgur.com/EYiJVoX.png';

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
  birthYear: 'Unknown',
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
  ...DEF_CREATOR,
  type: AuthorType.Actor,
  name: 'Unknown actor',
};
