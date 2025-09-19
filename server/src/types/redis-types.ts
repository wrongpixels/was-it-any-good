import {
  FilmResponse,
  SeasonResponse,
  ShowResponse,
} from '../../../shared/types/models';

export type RedisMediaEntry =
  | FilmResponse
  | ShowResponse
  | SeasonResponse
  | undefined;
