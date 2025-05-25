import Country from '../countries/countryTypes';
import {
  FilmGenre,
  ShowGenre,
  GameGenre,
  GameplayGenre,
} from '../genres/genreTypes';
import {
  FilmParental,
  GameParental,
  ParentalGuide,
} from '../parental/parentalTypes';

export type Image = string;

export interface ReleaseDate {
  date: Date | null;
  isUnknown: boolean;
}
export interface BirthDate {
  year: number;
  isUnknown: boolean;
}

export interface Rating {
  value: number;
  isValid: boolean;
  voteCount: number;
}
enum MediaType {
  Film = 'Film',
  Show = 'Show',
  Game = 'Game',
}

enum SubMediaType {
  None = 'None',
  Season = 'Season',
  Chapter = 'Chapter',
  DLC = 'DLC',
}

export enum AuthorType {
  Director = 'Director',
  Writer = 'Writer',
  Actor = 'Actor',
  Unknown = 'Unknown',
}

interface Individual {
  id: number;
  name: string;
  country: Country;
  image: Image;
}

interface Creator extends Individual {
  media?: Media[];
}

interface Author extends Creator {
  type: AuthorType;
  birthDate: BirthDate;
}

export interface Director extends Author {
  type: AuthorType.Director;
}

export interface Writer extends Author {
  type: AuthorType.Writer;
}
interface Actor extends Author {
  type: AuthorType.Actor;
}
export interface Character extends Individual {
  actor: Actor;
}
interface Studio extends Individual {}

export type Direction = Director[];
export type Cast = Character[];
export type Writing = Writer[];
export type Studios = Studio[];

interface Media {
  id: number;
  name: string;
  originalName: string;
  sortname: string;
  description: string;
  parentalGuide: ParentalGuide;
  releaseDate: ReleaseDate;
  image: Image;
  rating: unknown | number;
  type: MediaType;
  genres: GameGenre[] | FilmGenre[] | ShowGenre[];
  subMedia: SubMediaType;
  studios: Studios;
  direction: Direction;
  writing: Writing;
  countries: Country[];
  cast: Cast;
}
export type CreateMedia = Omit<Media, 'id'>;

interface Film extends Media {
  type: MediaType.Film;
  subMedia: SubMediaType.None;
  parentalGuide: FilmParental;
  genres: FilmGenre[];
}
export type CreateFilm = Omit<Film, 'id'>;

interface Show extends Media {
  type: MediaType.Show;
  subMedia: SubMediaType.Season;
  seasons: Season[];
  genres: ShowGenre[];
}
export type CreateShow = Omit<Show, 'id'>;

interface Game extends Media {
  type: MediaType.Game;
  subMedia: SubMediaType.Chapter | SubMediaType.DLC;
  parentalGuide: GameParental;
  dlc: DLC[];
  chapters: Chapter[];
  genres: GameGenre[];
  gamePlayGenres: GameplayGenre[];
}
export type CreateGame = Omit<Game, 'id'>;

interface SubMedia extends Media {
  subType: SubMediaType;
  parentId: number;
}
export type CreateSubMedia = Omit<SubMedia, 'id'>;

interface Season extends SubMedia {
  type: MediaType.Show;
  subType: SubMediaType.Season;
}
export type CreateSeason = Omit<Season, 'id'>;

interface DLC extends SubMedia {
  type: MediaType.Game;
  subType: SubMediaType.DLC;
}
export type CreateDLC = Omit<DLC, 'id'>;

interface Chapter extends SubMedia {
  type: MediaType.Game;
  subType: SubMediaType.Chapter;
}
export type CreateChapter = Omit<Chapter, 'id'>;

export {
  Individual,
  Creator,
  Media,
  Author,
  MediaType,
  Film,
  Actor,
  Studio,
  Show,
  Season,
  Game,
  DLC,
  Chapter,
};
