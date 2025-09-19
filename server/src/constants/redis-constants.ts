import { MediaType } from '../../../shared/types/media';

export const DEF_REDIS_CACHE_TIME: number = 3600;
export const REDIS_ENABLED: boolean = true;

export const REDIS_FILM_KEY: string = 'film';
export const REDIS_SHOW_KEY: string = 'show';
export const REDIS_SEASON_KEY: string = 'season';

export const getRedisBaseKeyForMediaType = (mediaType: MediaType) => {
  switch (mediaType) {
    case MediaType.Film:
      return REDIS_FILM_KEY;
    case MediaType.Show:
      return REDIS_SHOW_KEY;
    case MediaType.Season:
      return REDIS_SEASON_KEY;
    default:
      return REDIS_FILM_KEY;
  }
};

export const getRedisMediaKey = (mediaType: MediaType, mediaId: number) => {
  return `${getRedisBaseKeyForMediaType(mediaType)}:${mediaId}`;
};

export const getRedisRatingKey = (userId: number, indexId: number) => {
  return `rating:${indexId}:user:${userId}:`;
};
