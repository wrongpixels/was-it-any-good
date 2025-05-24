import Country from './countryTypes';

enum MediaType {
  'Film',
  'Show',
  'Game',
}

enum SubMediaType {
  'Season',
  'Chapter',
  'DLC',
}

enum AuthorType {
  'Director',
  'Writer',
  'Actor',
}

interface Individual {
  id: number;
  name: string;
  country: Country;
}

interface Creator extends Individual {
  media: Media[];
}

interface Author extends Creator {
  type: AuthorType;
}

interface Director extends Author {
  type: AuthorType.Director;
}

interface Writer extends Author {
  type: AuthorType.Writer;
}
interface Actor extends Author {
  type: AuthorType.Actor;
}

interface Studio extends Individual {}

interface Media {
  id: number;
  name: string;
  sortname: string;
  year: number;
  image: string;
  rating: number;
  type: MediaType;
  studios: Studio[];
  directors: Director[];
  writers: Writer[];
  countries: Country[];
}

interface Film extends Media {
  type: MediaType.Film;
  subMedia: SubMediaType.Season;
}

export { Media, Author, MediaType, Film, Actor };
