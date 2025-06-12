import { CountryCode } from './countries';

export interface GenreResponse {
  id: number;
  name: string;
  tmdbId?: number | undefined;
  gamedbId?: number | undefined;
}

export interface PersonResponse {
  id: number;
  name: string;
  tmdbId?: string | undefined;
  gamedbId?: string | undefined;
  image: string;
  birthDate?: string | undefined;
  country: CountryCode[];
}

export interface BaseMediaResponse {
  id: number;
  tmdbId?: string;
  imdbId?: string;
  name: string;
  originalName: string;
  description: string;
  image: string;
  voteCount: number;
  rating: number | null;
  releaseDate: string;
}

export interface SeasonResponse extends BaseMediaResponse {
  index: number;
  episodeCount: number;
}

export interface MediaResponse extends BaseMediaResponse {
  parentalGuide: 'G' | 'PG' | 'PG13' | 'R' | 'NC17' | 'UNKNOWN' | null;
  sortName: string;
  country: CountryCode[];
  status: string;
  runtime: number | null;
  cast?: ResponseCastMember[];
  crew?: ResponseCrewMember[];
  genres?: GenreResponse[];
}

export interface FilmResponse extends MediaResponse {}

export interface ShowResponse extends MediaResponse {
  lastAirDate: string;
  episodeCount: number;
  seasonCount: number;
  seasons?: SeasonResponse[];
}

export type NoCredFilmResponse = Omit<FilmResponse, 'crew' | 'cast'>;
export type NoCredShowResponse = Omit<ShowResponse, 'crew' | 'cast'>;

export interface ResponseCastMember {
  id: number;
  characterName: string[];
  order: number;
  person: PersonResponse[];
}

export interface ResponseCrewMember {
  id: number;
  role: string;
  person: PersonResponse[];
}
