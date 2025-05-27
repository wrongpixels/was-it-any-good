import Country from '../countries/country-types';
import { CreateGenreData } from '../genres/genre-types';

export interface TMDBFilmData {
  id: number;
  genres: CreateGenreData[];
  imdb_id: string;
  origin_country: Country[];
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  runtime: number;
  status: string;
  adult: boolean;
  credits: TMDBCreditsData;
}

export interface TMDBEntry {
  id: number;
  name: string;
}

export interface TMDBGenreData extends TMDBEntry {}
export interface TMDBStudioData extends TMDBEntry {
  logo_path: string | null;
  origin_country: Country;
}

export interface TMDBCreditsData {
  id: number;
  cast: TMDBCastData[];
  crew: TMDBCrewData[];
}

export interface TMDBRoleData extends TMDBEntry {
  adult: boolean;
  gender: number;
  credit_id: string;
  known_for_department: string;
}

export interface TMDBCastData extends TMDBRoleData {
  order: number;
  character: string;
}

export interface TMDBCrewData extends TMDBRoleData {
  job: string;
  department: string;
}

export type TMDBAcceptedDepartments =
  | 'Writing'
  | 'Directing'
  | 'Acting'
  | 'Sound';

export enum TMDBAcceptedJobs {
  Screenplay = 'Screenplay',
  Director = 'Director',
  OriginalMusicComposer = 'Original Music Composer',
}
