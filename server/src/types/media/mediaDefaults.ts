import Country from '../countryTypes';
import {
  Author,
  Creator,
  Director,
  Individual,
  AuthorType,
  Writer,
  Studio,
} from './mediaTypes';

export const DEF_INDIVIDUAL: Individual = {
  id: -1,
  name: 'Unknown',
  country: Country.UNKNOWN,
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
  name: 'Unknown Director',
};

export const DEF_WRITER: Writer = {
  ...DEF_AUTHOR,
  type: AuthorType.Writer,
  name: 'Unknown Writer',
};

export const DEF_STUDIO: Studio = {
  ...DEF_INDIVIDUAL,
  name: 'Unknown Studio',
};
