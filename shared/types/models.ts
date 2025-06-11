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
  country: string[];
}

export interface MediaResponse {
  id: number;
  name: string;
  originalName: string;
  sortName: string;
  description: string | null;
  country: string[];
  status: string | null;
  releaseDate: string | null;
  image: string | null;
  rating: number | null;
  voteCount: number;
  runtime: number | null;
  cast?: ResponseCastMember[];
  crew?: ResponseCrewMember[];
  genres?: GenreResponse[];
}

export interface 

export interface FilmResponse extends MediaResponse {
  tmdbId: string;
  imdbId?: string;
  parentalGuide: 'G' | 'PG' | 'PG13' | 'R' | 'NC17' | 'UNKNOWN' | null;
}

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
