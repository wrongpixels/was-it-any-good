import { CountryCode } from './countries'
import { MediaType } from './media'

export interface RatingData {
  id: number
  userId: number
  mediaId: number
  mediaType: MediaType
  createdAt: string
  updatedAt: string
}

export type CreateRating = Omit<
  RatingData,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>
export interface CreateRatingData extends CreateRating {
  userId: number
}

export interface ActiveUser {
  isValid: boolean
  id: number
  name: string | null
  username: string
  isAdmin: boolean
  isActive: boolean
  lastActive: Date | null
}

export interface UserData extends Omit<ActiveUser, 'isValid'> {
  hash: string
  email: string
  pfp: string | null
}

export interface CreateUser extends Omit<UserData, 'id' | 'hash'> {
  password: string
}

export interface DefaultUser
  extends Pick<UserData, 'pfp' | 'lastActive' | 'isActive' | 'isAdmin'> {}

export interface CreateUserData extends Omit<UserData, 'id'> {}

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

export interface BaseResponse {
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

export interface SeasonResponse extends BaseResponse {
  index: number
  episodeCount: number
}

export interface BaseMediaResponse extends BaseResponse {
  sortName: string
  country: CountryCode[]
  status: string
  runtime: number | null
  cast?: CreditResponse[]
  crew?: CreditResponse[]
  genres?: GenreResponse[]
  mergedCrew?: MergedCredits[]
  mediaType: MediaType
}

export interface FilmResponse extends BaseMediaResponse {
  mediaType: MediaType.Film
}

export interface ShowResponse extends BaseMediaResponse {
  mediaType: MediaType.Show
  lastAirDate: string
  episodeCount: number
  seasonCount: number
  seasons?: SeasonResponse[]
}

export type MediaResponse = FilmResponse | ShowResponse

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
