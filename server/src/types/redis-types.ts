import {
  FilmResponse,
  RatingData,
  SeasonResponse,
  ShowResponse,
} from '../../../shared/types/models';

export type RedisMediaEntry =
  | FilmResponse
  | ShowResponse
  | SeasonResponse
  | undefined;

export type RedisRatingEntry = RatingData | undefined;
