import { createClient, RedisClientType } from 'redis';
import { Request } from 'express';
import { redisClient } from '../util/config';
import {
  DEF_REDIS_CACHE_TIME,
  getRedisMediaKey,
  REDIS_ENABLED,
} from '../constants/redis-constants';
import { MediaType } from '../../../shared/types/media';
import {
  FilmResponse,
  SeasonResponse,
  ShowResponse,
} from '../../../shared/types/models';
import { Rating } from '../models';

export const initializeRedis = (URI: string): RedisClientType | undefined => {
  // we skip the setup if no valid REDIS URI

  if (URI && REDIS_ENABLED) {
    const redisClient: RedisClientType = createClient({ url: URI });
    redisClient.on('error', (err: Error) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      // console.log('Connecting to Redis...');
    });

    redisClient.on('ready', () => {
      console.log('Connected to Redis');
    });
    redisClient.connect().catch(console.error);
    return redisClient;
  }
  if (!REDIS_ENABLED) {
    console.log('Redis is currently disabled.');
  }
  return undefined;
};

interface MediaRatingUpdate {
  rating: number;
  voteCount: number;
}

export const getMediaFromCache = async (
  mediaType: MediaType,
  mediaId: number
): Promise<FilmResponse | ShowResponse | SeasonResponse | undefined> => {
  const mediaKey: string = getRedisMediaKey(mediaType, mediaId);
  const entryString: string | null | undefined =
    await redisClient?.get(mediaKey);
  if (!entryString) {
    return;
  }
  const mediaEntry: FilmResponse | ShowResponse | SeasonResponse | undefined =
    JSON.parse(entryString);
  return mediaEntry;
};

//to update the cache of the media entries
export const updateVotedMediaCache = async (
  ratingValues: MediaRatingUpdate,
  ratingEntry: Rating
) => {
  if (!redisClient) {
    return;
  }
  const { mediaId, mediaType /* userId, userScore, indexId */ } = ratingEntry;
  const mediaKey: string = getRedisMediaKey(mediaType, mediaId);

  const mediaEntry: FilmResponse | ShowResponse | SeasonResponse | undefined =
    await getMediaFromCache(mediaType, mediaId);
  if (!mediaEntry) {
    return;
  }
  mediaEntry.rating = ratingValues.rating;
  mediaEntry.voteCount = ratingValues.voteCount;
  redisClient.setEx(mediaKey, DEF_REDIS_CACHE_TIME, JSON.stringify(mediaEntry));
  console.log('Updated votes of key:', mediaKey);
};

export const setActiveCache = async (
  req: Request,
  value: unknown,
  //expire in 1 hour by default. Undefined or setting <= 0 means no expiration
  expiration: number | undefined = DEF_REDIS_CACHE_TIME
): Promise<void | string | null> => {
  //if we didn't setup the server, we skip the cache
  if (!redisClient) {
    return;
  }
  if (!req.activeRedisKey) {
    console.error('Request does not have an active Redis key');
    return;
  }
  const expires: boolean = !!expiration && expiration > 0;
  const stringData: string = JSON.stringify(value);
  console.log('Creating cache key:', req.activeRedisKey);

  return await (expires
    ? redisClient.setEx(req.activeRedisKey, expiration, stringData)
    : redisClient.set(req.activeRedisKey, stringData));
};
