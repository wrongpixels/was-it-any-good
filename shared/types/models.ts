import { CountryCode } from "./countries";
import { MediaType } from "./media";
import { AuthorType, SortedRoles } from "./roles";

export interface MediaRoleResponse {
  id: number;
  role: AuthorType;
  mediaId: number;
  mediaType: MediaType;
  characterName: string[];
  film?: FilmResponse;
  show?: ShowResponse;
}

export interface CreateIndexMedia {
  tmdbId: number;
  //optional field for seasons
  showId?: number;
  addedToMedia: boolean;
  country: CountryCode[];
  name: string;
  image: string;
  rating: number;
  year: number | null;
  baseRating: number;
  voteCount: number;
  popularity: number;
  mediaType: MediaType;
}

export interface IndexMediaData extends CreateIndexMedia {
  id: number;
  film?: FilmResponse;
  show?: ShowResponse;
  season?: SeasonResponse;
}

export type BrowseResultsType = "browse" | "votes";

//for browse/search results
interface BrowseResults {
  page: number;
  totalPages: number;
  totalResults: number;
  resultsType: BrowseResultsType;
  totalFilms?: number;
  totalShows?: number;
  totalSeasons?: number;
}

export interface IndexMediaResults extends BrowseResults {
  indexMedia: IndexMediaData[];
  resultsType: "browse";
}

export interface RatingResults extends BrowseResults {
  ratings: RatingData[];
  resultsType: "votes";
}
export interface RatingData {
  id: number;
  indexId: number;
  userId: number;
  mediaId: number;
  userScore: number;
  mediaType: MediaType;
  updatedAt?: Date;
  indexMedia?: IndexMediaData;
  showId?: number;
  show?: ShowResponse;
  film?: FilmResponse;
  season?: SeasonResponse;
}

export interface RatingStats {
  rating: number;
  voteCount: number;
}

export interface CreateRatingResponse extends RatingData {
  ratingStats: RatingStats;
}

export interface CreateRating extends Omit<RatingData, "id" | "userId"> {}
export interface CreateRatingData extends Omit<CreateRating, "seasonId"> {
  userId: number;
}
export interface CheckRating extends Omit<CreateRating, "userScore"> {
  userId?: number;
}

export interface RemoveRatingResponse extends CheckRating {
  ratingStats: RatingStats;
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

export interface UserData extends Omit<ActiveUser, "isValid"> {
  hash: string;
  email: string;
  pfp: string | null;
}

export interface CreateUser extends Omit<UserData, "id" | "hash"> {
  password: string;
}

export interface VerifyCreateUser
  extends Omit<
    CreateUser,
    "pfp" | "name" | "isActive" | "lastActive" | "isAdmin"
  > {
  isAdmin?: boolean;
  isActive?: boolean;
}
export interface CreateUserData extends Omit<UserData, "id"> {}

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
  extends Omit<UserSessionData, "id" | "createdAt" | "updatedAt"> {}

export interface LoginData {
  username: string;
  password: string;
}

export interface DefaultUser
  extends Pick<UserData, "pfp" | "lastActive" | "isActive" | "isAdmin"> {}

export interface GenreResponse {
  id: number;
  name: string;
  tmdbId?: number | undefined;
  gamedbId?: number | undefined;
}

export interface PersonResponse {
  id: number;
  name: string;
  tmdbId?: number;
  gamedbId?: string | undefined;
  image: string;
  birthDate?: string | undefined;
  country: CountryCode[];
  addedDetails: boolean;
  birthPlace?: string;
  deathDate?: string;
  description?: string;
  roles?: MediaRoleResponse[];
  sortedRoles?: SortedRoles;
}

export interface BaseResponse {
  id: number;
  tmdbId?: number;
  imdbId?: string;
  name: string;
  originalName: string;
  description: string;
  image: string;
  voteCount: number;
  baseRating: number;
  popularity: number;
  rating: number;
  mediaType: MediaType;
  releaseDate: string | null;
}

export interface SeasonResponse extends BaseResponse {
  index: number;
  indexId: number;

  episodeCount: number;
  showId: number;
  mediaType: MediaType.Season;
  userRating?: RatingData | null;
}

export interface BrowseResponse {
  totalFilmResults: number;
  totalShowResults: number;
  page: number;
  totalPages: number;
  showResults?: IndexMediaData[];
  filmResults?: IndexMediaData[];
}

export interface BaseMediaResponse extends BaseResponse {
  sortName: string;
  country: CountryCode[];
  status: string;
  runtime: number | null;
  indexId: number;
  updatedAt?: Date;
  userRating?: RatingData | null;
  cast?: CreditResponse[];
  crew?: CreditResponse[];
  genres?: GenreResponse[];
  mergedCrew?: MergedCredits[];
  indexMedia?: IndexMediaData;
  userWatchlist?: UserMediaListItemData;
}

export interface FilmResponse extends BaseMediaResponse {
  mediaType: MediaType.Film;
}

export interface ShowResponse extends BaseMediaResponse {
  mediaType: MediaType.Show;
  lastAirDate: string | null;
  episodeCount: number;
  seasonCount: number;
  indexId: number;
  seasons?: SeasonResponse[];
}

export type MediaResponse = FilmResponse | ShowResponse;

export interface CreditResponse {
  id: number;
  role: AuthorType;
  characterName?: string[];
  order?: number;
  person: PersonResponse;
}

export interface MergedCredits {
  mergedRoles: AuthorType[];
  order: number;
  person: PersonResponse;
}

export interface CreateMediaGenre {
  mediaId: number;
  genreId: number;
  mediaType: MediaType;
}

export interface UserMediaListItemData {
  id: number;
  indexInList: number;
  userListId: number;
  userList?: UserMediaListData;
  indexId: number;
  indexMedia?: IndexMediaData;
  createdAt?: Date;
  updatedAt?: Date;
}

export const USER_MEDIA_LIST_ICONS = [
  "fav-film",
  "fav-show",
  "fav-multi",
  "film",
  "show",
  "season",
  "multi",
  "like",
  "watchlist",
  "other",
] as const;

export type UserMediaListIcon = (typeof USER_MEDIA_LIST_ICONS)[number];

export interface CreateUserMediaListItem
  extends Omit<
    UserMediaListItemData,
    "id" | "indexMedia" | "userList" | "createdAt" | "updatedAt"
  > {}

export interface UserMediaListData {
  id: number;
  name: string;
  description: string;
  userId: number;
  indexInUserLists: number;
  mediaTypes: MediaType[];
  lockedMediaType: boolean;
  private: boolean;
  autoCleanItems: boolean;
  canBeModified: boolean;
  icon: UserMediaListIcon;
  createdAt?: Date;
  updatedAt?: Date;
  listItems?: UserMediaListItemData[];
}

export interface CreateUserMediaList
  extends Omit<
    UserMediaListData,
    "id" | "listItems" | "createdAt" | "updatedAt" | "icon" | "canBeModified"
  > {
  icon?: UserMediaListIcon;
  canBeModified?: boolean;
}
