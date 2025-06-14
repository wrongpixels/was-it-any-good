import { CountryCode } from './countries'

export interface GenreResponse {
  id: number
  name: string
  tmdbId?: number | undefined
  gamedbId?: number | undefined
}

export interface PersonResponse {
  id: number
  name: string
  tmdbId?: string | undefined
  gamedbId?: string | undefined
  image: string
  birthDate?: string | undefined
  country: CountryCode[]
}

export interface BaseMediaResponse {
  id: number
  tmdbId?: string
  imdbId?: string
  name: string
  originalName: string
  description: string
  image: string
  voteCount: number
  baseRating: number
  rating: number | null
  releaseDate: string
}

export interface SeasonResponse extends BaseMediaResponse {
  index: number
  episodeCount: number
}

export interface MediaResponse extends BaseMediaResponse {
  sortName: string
  country: CountryCode[]
  status: string
  runtime: number | null
  cast?: CreditResponse[]
  crew?: CreditResponse[]
  genres?: GenreResponse[]
  mergedCrew?: MergedCredits[]
}

export interface FilmResponse extends MediaResponse {}

export interface ShowResponse extends MediaResponse {
  lastAirDate: string
  episodeCount: number
  seasonCount: number
  seasons?: SeasonResponse[]
}

export type NoCredFilmResponse = Omit<FilmResponse, 'crew' | 'cast'>
export type NoCredShowResponse = Omit<ShowResponse, 'crew' | 'cast'>

export interface CreditResponse {
  id: number
  role: string
  characterName?: string[]
  order?: number
  person: PersonResponse
}

export interface MergedCredits {
  mergedRoles: string[]
  person: PersonResponse
}
