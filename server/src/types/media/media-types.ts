import { CountryCode } from '../../../../shared/types/countries';
import { CreateGenreData } from '../genres/genre-types';
import {
  FilmParental,
  ParentalGuide,
  ShowParental,
} from '../parental/parental-types';
import { Image } from '../../../../shared/types/common';
import { ActiveUser } from '../../../../shared/types/models';
import { FindOptions, ScopeOptions, Transaction } from 'sequelize';
import { MediaType } from '../../../../shared/types/media';

export interface BirthDate {
  year: number;
  isUnknown: boolean;
}

export interface MediaQueryValues {
  mediaId: number | string;
  mediaType: MediaType;
  plainData?: boolean;
  isTmdbId?: boolean;
  unscoped?: boolean;
  activeUser?: ActiveUser;
  transaction?: Transaction;
}
export interface MediaQueryOptions {
  findOptions: FindOptions;
  scopeOptions: (string | ScopeOptions)[];
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
  Creator = 'Creator',
  Producer = 'Producer',
  ExecProducer = 'Executive Producer',
  MusicComposer = 'Original Music Composer',
  Actor = 'Actor',
  Unknown = 'Unknown',
}

export enum RoleType {
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
export interface IndividualData {
  name: string;
  country?: CountryCode;
  image: Image;
  tmdbId?: number;
}

export interface AuthorData extends IndividualData {
  type: AuthorType;
  birthDate?: BirthDate;
}
export interface RoleData extends AuthorData {
  character: string[];
  description?: string;
  roleType: RoleType;
  order: number;
}

export type MediaPerson = AuthorData | RoleData;

export interface StudioData extends IndividualData {}

// Media
export interface MediaData {
  name: string;
  status: string;
  originalName: string;
  sortName: string;
  description: string;
  parentalGuide: ParentalGuide;
  releaseDate: string | null;
  image: Image;
  rating: number;
  baseRating: number;
  voteCount: number;
  popularity: number;
  runtime: number;
  userReviews?: number[];
  criticReviews?: number[];
  mediaType: MediaType;
  genres: CreateGenreData[];
  subMedia: SubMediaType;
  studios: StudioData[];
  cast: RoleData[];
  crew: AuthorData[];
  countries: CountryCode[];
}

// Media types
export interface FilmData extends MediaData {
  tmdbId: number;
  imdbId: string | null;
  mediaType: MediaType.Film;
  subMedia: SubMediaType.None;
  parentalGuide: FilmParental;
}

export interface ShowData extends MediaData {
  tmdbId: number;
  imdbId: string | null;
  mediaType: MediaType.Show;
  lastAirDate: string | null;
  subMedia: SubMediaType.Season;
  parentalGuide: ShowParental;
  episodeCount: number;
  seasonCount: number;
  seasons: SeasonData[];
}
/*
export interface GameData extends MediaData {
  subMedia: SubMediaType.Chapter | SubMediaType.DLC;
  parentalGuide: GameParental;
  dlcIds: number[];
  chapterIds: number[];
  gamePlayGenres: GameplayGenre[];
} */

// Sub-media types
export interface SubMediaData extends MediaData {
  subType: SubMediaType;
  index: number;
}

export interface SeasonData extends SubMediaData {
  tmdbId: number;
  imdbId?: string;
  episodeCount: number;
  mediaType: MediaType.Season;
  subType: SubMediaType.Season;
}
/*
export interface DLCData extends SubMediaData {
  mediaType: MediaType.Game;
  subType: SubMediaType.DLC;
}

export interface ChapterData extends SubMediaData {
  mediaType: MediaType.Game;
  subType: SubMediaType.Chapter;
}
*/
// Creation
export interface TMDBData {
  tmdbId: number;
  imdbId: string | null;
  description: string;
  popularity: number;
  baseRating: number;
  image: string;
  countries: CountryCode[];
  genres: CreateGenreData[];
  cast: RoleData[];
  crew: AuthorData[];
  studios: StudioData[];
}

export type DefaultMedia = Omit<
  MediaData,
  'name' | 'sortName' | 'originalName' | 'description' | 'genres' | 'subMedia'
>;
export type DefaultFilm = Omit<
  FilmData,
  | 'name'
  | 'sortName'
  | 'tmdbId'
  | 'imdbId'
  | 'originalName'
  | 'description'
  | 'genres'
>;
export type DefaultShow = Omit<
  ShowData,
  | 'name'
  | 'sortName'
  | 'seasons'
  | 'tmdbId'
  | 'imdbId'
  | 'originalName'
  | 'description'
  | 'genres'
  | 'seasonIds'
>;
/*
export type DefaultGame = Omit<
  GameData,
  | 'name'
  | 'sortName'
  | 'originalName'
  | 'description'
  | 'genres'
  | 'gamePlayGenres'
  | 'chapterIds'
  | 'dlcIds'
>; */
export type DefaultSeason = Omit<
  SeasonData,
  'originalName' | 'tmdbId' | 'description'
>;
/*
export type DefaultDLC = Omit<
  DLCData,
  'originalName' | 'description' | 'genres'
>;
export type DefaultChapter = Omit<
  ChapterData,
  'originalName' | 'description' | 'genres'
>;
*/
