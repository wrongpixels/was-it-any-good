import Country from '../countries/country-types';
import { CreateGenreData, GameplayGenre } from '../genres/genre-types';
import {
  FilmParental,
  GameParental,
  ParentalGuide,
  ShowParental,
} from '../parental/parentaly-types';

export type Image = string;

export interface ReleaseDate {
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
  tmdbId?: number;
  tvdbId?: number;
}

export interface CreatorData extends IndividualData {
  mediaIds?: number[];
}

export interface AuthorData extends CreatorData {
  type: AuthorType;
  birthDate?: BirthDate;
}

export interface DirectorData extends AuthorData {
  type: AuthorType.Director;
}

export interface WriterData extends AuthorData {
  type: AuthorType.Writer;
}

export interface ActorData extends AuthorData {
  type: AuthorType.Actor;
}

export interface RoleData extends IndividualData {
  character: string;
  description?: string;
  roleType: RoleType;
}

export interface StudioData extends IndividualData {}

// Media
export interface MediaData {
  name: string;
  status: string;
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
  genres: CreateGenreData[];
  subMedia: SubMediaType;
  studios: StudioData[];
  directors: DirectorData[];
  writers: WriterData[];
  countries: Country[];
  cast: RoleData[];
}

// Media types
export interface FilmData extends MediaData {
  tmdbId: number;
  type: MediaType.Film;
  subMedia: SubMediaType.None;
  parentalGuide: FilmParental;
}

export interface ShowData extends MediaData {
  tvdbId: number;
  type: MediaType.Show;
  subMedia: SubMediaType.Season;
  parentalGuide: ShowParental;
  seasonIds: number[];
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
  parentId: number;
  index: number;
}

export interface SeasonData extends SubMediaData {
  tvdbId: number;
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
export type CreateFilmData = Omit<FilmData, 'id'>;
export type DefaultFilm = Omit<
  CreateFilmData,
  'name' | 'sortName' | 'tmdbId' | 'originalName' | 'description' | 'genres'
>;
export type CreateShowData = Omit<ShowData, 'id'>;
export type DefaultShow = Omit<
  CreateShowData,
  | 'name'
  | 'sortName'
  | 'tvdbId'
  | 'originalName'
  | 'description'
  | 'genres'
  | 'seasonIds'
>;
export type CreateGameData = Omit<GameData, 'id'>;
export type DefaultGame = Omit<
  CreateGameData,
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
  'originalName' | 'tvdbId' | 'description' | 'genres'
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
