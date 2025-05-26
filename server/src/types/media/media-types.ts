import Country from '../countries/country-types';
import {
  FilmGenre,
  ShowGenre,
  GameGenre,
  GameplayGenre,
} from '../genres/genre-types';
import {
  FilmParental,
  GameParental,
  ParentalGuide,
  ShowParental,
} from '../parental/parentaly-types';

export type Image = string;
export type Direction = number[];
export type Writing = number[];
export type Studios = number[];
export type Cast = number[];

export interface ReleaseDate {
  date: Date | null;
  isUnknown: boolean;
}

export interface BirthDate {
  year: number;
  isUnknown: boolean;
}

export interface MediaRating {
  score: number;
  isValid: boolean;
  voteCount: number;
}

// Enums
export enum MediaType {
  Film = 'Film',
  Show = 'Show',
  Game = 'Game',
}

export enum SubMediaType {
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

export enum CastRole {
  Main = 'Main',
  Supporting = 'Supporting',
  GuestStar = 'Guest star',
  Cameo = 'Cameo',
  Narration = 'Narration',
  AdditionalVoices = 'Additional voices',
  Unknown = 'Unknown',
}

export enum PerformanceType {
  LiveAction = 'Live Action',
  Voice = 'Voice',
  MotionCapture = 'Motion Capture',
  Other = 'Other',
}

// People
export interface Individual {
  id: number;
  name: string;
  country: Country;
  image: Image;
}

export interface Creator extends Individual {
  mediaIds?: number[];
}

export interface Author extends Creator {
  type: AuthorType;
  birthDate: BirthDate;
}

export interface Director extends Author {
  type: AuthorType.Director;
}

export interface Writer extends Author {
  type: AuthorType.Writer;
}

export interface Actor extends Author {
  type: AuthorType.Actor;
}

export interface Character extends Individual {
  mediaId: number;
  actorId: number;
  description?: string;
  role: CastRole;
}

export interface Studio extends Individual {}

// Media
export interface MediaData {
  id: number;
  name: string;
  originalName: string;
  sortName: string;
  description: string;
  parentalGuide: ParentalGuide;
  releaseDate: ReleaseDate;
  image: Image;
  rating: MediaRating;
  runtime: number;
  userReviews?: number[];
  criticReviews?: number[];
  type: MediaType;
  genres: GameGenre[] | FilmGenre[] | ShowGenre[];
  subMedia: SubMediaType;
  studios: number[];
  directors: number[];
  writers: number[];
  countries: Country[];
  cast: number[];
}

// Media types
export interface FilmData extends MediaData {
  type: MediaType.Film;
  subMedia: SubMediaType.None;
  parentalGuide: FilmParental;
  genres: FilmGenre[];
}

export interface ShowData extends MediaData {
  type: MediaType.Show;
  subMedia: SubMediaType.Season;
  parentalGuide: ShowParental;
  seasonIds: number[];
  genres: ShowGenre[];
}

export interface GameData extends MediaData {
  type: MediaType.Game;
  subMedia: SubMediaType.Chapter | SubMediaType.DLC;
  parentalGuide: GameParental;
  dlcIds: number[];
  chapterIds: number[];
  genres: GameGenre[];
  gamePlayGenres: GameplayGenre[];
}

// Sub-media types
export interface SubMediaData extends MediaData {
  subType: SubMediaType;
  parentId: number;
  index: number;
}

export interface SeasonData extends SubMediaData {
  type: MediaType.Show;
  subType: SubMediaType.Season;
}

export interface DLCData extends SubMediaData {
  type: MediaType.Game;
  subType: SubMediaType.DLC;
}

export interface ChapterData extends SubMediaData {
  type: MediaType.Game;
  subType: SubMediaType.Chapter;
}

// Creation
export type CreateMedia = Omit<MediaData, 'id'>;
export type DefaultMedia = Omit<
  CreateMedia,
  | 'name'
  | 'sortName'
  | 'originalName'
  | 'description'
  | 'type'
  | 'genres'
  | 'subMedia'
>;
export type CreateFilm = Omit<FilmData, 'id'>;
export type DefaultFilm = Omit<
  CreateFilm,
  'name' | 'sortName' | 'originalName' | 'description' | 'genres'
>;
export type CreateShow = Omit<ShowData, 'id'>;
export type DefaultShow = Omit<
  CreateShow,
  'name' | 'sortName' | 'originalName' | 'description' | 'genres' | 'seasonIds'
>;
export type CreateGame = Omit<GameData, 'id'>;
export type DefaultGame = Omit<
  CreateGame,
  | 'name'
  | 'sortName'
  | 'originalName'
  | 'description'
  | 'genres'
  | 'gamePlayGenres'
  | 'chapterIds'
  | 'dlcIds'
>;
export type CreateSubMedia = Omit<SubMediaData, 'id'>;
export type CreateSeason = Omit<SeasonData, 'id'>;
export type DefaultSeason = Omit<
  CreateSeason,
  'originalName' | 'description' | 'genres'
>;
export type CreateDLC = Omit<DLCData, 'id'>;
export type DefaultDLC = Omit<
  CreateDLC,
  'originalName' | 'description' | 'genres'
>;
export type CreateChapter = Omit<ChapterData, 'id'>;
export type DefaultChapter = Omit<
  CreateChapter,
  'originalName' | 'description' | 'genres'
>;
