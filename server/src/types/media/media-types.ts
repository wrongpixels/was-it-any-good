import Country from '../countries/country-types';
import { CreateGenreData, GameplayGenre } from '../genres/genre-types';
import {
  FilmParental,
  GameParental,
  ParentalGuide,
  ShowParental,
} from '../parental/parental-types';

export type Image = string;

export interface AirDate {
  date: string | null;
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
  country?: Country;
  image: Image;
  tmdbId?: string;
}

export interface AuthorData extends IndividualData {
  type: AuthorType;
  birthDate?: BirthDate;
}
export interface RoleData extends AuthorData {
  character: string;
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
  releaseDate: AirDate;
  image: Image;
  rating: MediaRating;
  runtime: number;
  userReviews?: number[];
  criticReviews?: number[];
  type: MediaType;
  genres: CreateGenreData[];
  subMedia: SubMediaType;
  studios: StudioData[];
  directors: AuthorData[];
  producers: AuthorData[];
  writers: AuthorData[];
  composers: AuthorData[];
  countries: Country[];
  cast: RoleData[];
}

// Media types
export interface FilmData extends MediaData {
  tmdbId: string;
  imdbId?: string;
  type: MediaType.Film;
  subMedia: SubMediaType.None;
  parentalGuide: FilmParental;
}

export interface ShowData extends MediaData {
  tmdbId: string;
  imdbId?: string;
  type: MediaType.Show;
  creators: AuthorData[];
  lastAirDate: AirDate;
  subMedia: SubMediaType.Season;
  parentalGuide: ShowParental;
  episodeCount: number;
  seasonCount: number;
  seasons: SeasonData[];
}

export interface GameData extends MediaData {
  type: MediaType.Game;
  subMedia: SubMediaType.Chapter | SubMediaType.DLC;
  parentalGuide: GameParental;
  dlcIds: number[];
  chapterIds: number[];
  gamePlayGenres: GameplayGenre[];
}

// Sub-media types
export interface SubMediaData extends MediaData {
  subType: SubMediaType;
  index: number;
}

export interface SeasonData extends SubMediaData {
  tmdbId: string;
  imdbId?: string;
  episodeCount: number;
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
export type DefaultMedia = Omit<
  MediaData,
  | 'name'
  | 'sortName'
  | 'originalName'
  | 'description'
  | 'type'
  | 'genres'
  | 'subMedia'
>;
export type DefaultFilm = Omit<
  FilmData,
  'name' | 'sortName' | 'tmdbId' | 'originalName' | 'description' | 'genres'
>;
export type DefaultShow = Omit<
  ShowData,
  | 'name'
  | 'sortName'
  | 'seasons'
  | 'tmdbId'
  | 'originalName'
  | 'description'
  | 'genres'
  | 'seasonIds'
>;
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
>;
export type DefaultSeason = Omit<
  SeasonData,
  'originalName' | 'tmdbId' | 'description'
>;
export type DefaultDLC = Omit<
  DLCData,
  'originalName' | 'description' | 'genres'
>;
export type DefaultChapter = Omit<
  ChapterData,
  'originalName' | 'description' | 'genres'
>;
