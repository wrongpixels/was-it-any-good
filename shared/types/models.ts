import { CountryCode } from './countries';
import { MediaType } from './media';
import { AuthorType } from './roles';

export interface MediaRoleResponse {
  id: number;
  role: AuthorType;
  mediaId: number;
  mediaType: MediaType;
  characterName: string[];
  show?: BriefMediaResponse;
  film?: BriefMediaResponse;
}

export interface BriefMediaResponse {
  id: number;
  name: string;
  image: string;
  rating: number;
  baseRating: number;
  mediaType: MediaType;
}

export interface RatingData {
  id: number;
  userId: number;
  mediaId: number;
  userScore: number;
  mediaType: MediaType;
}

export type CreateRating = Omit<RatingData, 'id' | 'userId'>;
export interface CreateRatingData extends CreateRating {
  userId: number;
}

export interface ActiveUser {
  isValid?: boolean;
  id: number;
  name: string | null;
  username: string;
  isAdmin: boolean;
  isActive: boolean;
  lastActive: Date | null;
}

export interface UserData extends Omit<ActiveUser, 'isValid'> {
  hash: string;
  email: string;
  pfp: string | null;
}

export interface CreateUser extends Omit<UserData, 'id' | 'hash'> {
  password: string;
}
export interface CreateUserData extends Omit<UserData, 'id'> {}

export interface UserSessionData {
  id: number;
  userId: number;
  username: string;
  token: string;
  expired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserSessionData
  extends Omit<UserSessionData, 'id' | 'createdAt' | 'updatedAt'> {}

export interface LoginData {
  username: string;
  password: string;
}

export interface DefaultUser
  extends Pick<UserData, 'pfp' | 'lastActive' | 'isActive' | 'isAdmin'> {}

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
  roles?: MediaRoleResponse[];
}

export interface BaseResponse {
  id: number;
  tmdbId?: string;
  imdbId?: string;
  name: string;
  originalName: string;
  description: string;
  image: string;
  voteCount: number;
  baseRating: number;
  rating: number | null;
  releaseDate: string | null;
}

export interface SeasonResponse extends BaseResponse {
  index: number;
  episodeCount: number;
}

export interface BaseMediaResponse extends BaseResponse {
  sortName: string;
  country: CountryCode[];
  status: string;
  runtime: number | null;
  cast?: CreditResponse[];
  crew?: CreditResponse[];
  genres?: GenreResponse[];
  mergedCrew?: MergedCredits[];
  mediaType: MediaType;
}

export interface FilmResponse extends BaseMediaResponse {
  mediaType: MediaType.Film;
}

export interface ShowResponse extends BaseMediaResponse {
  mediaType: MediaType.Show;
  lastAirDate: string | null;
  episodeCount: number;
  seasonCount: number;
  seasons?: SeasonResponse[];
}

export type MediaResponse = FilmResponse | ShowResponse;

export type NoCredFilmResponse = Omit<FilmResponse, 'crew' | 'cast'>;
export type NoCredShowResponse = Omit<ShowResponse, 'crew' | 'cast'>;

export interface CreditResponse {
  id: number;
  role: string;
  characterName?: string[];
  order?: number;
  person: PersonResponse;
}

export interface MergedCredits {
  mergedRoles: string[];
  person: PersonResponse;
}
