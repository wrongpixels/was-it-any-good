import { Request } from 'express';
import {
  getRedisMediaKey,
  DEF_REDIS_CACHE_TIME,
  getRedisRatingKey,
} from '../constants/redis-constants';
import { RedisMediaEntry, RedisRatingEntry } from '../types/redis-types';
import { redisClient } from './config';
import {
  FilmResponse,
  RatingData,
  SeasonResponse,
  ShowResponse,
} from '../../../shared/types/models';

interface MediaRatingUpdate {
  rating: number;
  voteCount: number;
}

//generic function to get from cache and try parse in sent type
export const getFromCache = async <T>(
  keyName: string
): Promise<T | undefined> => {
  if (!redisClient) {
    return;
  }
  const entryString: string | null | undefined =
    await redisClient?.get(keyName);
  if (!entryString) {
    return;
  }
  try {
    const entry: T | undefined = { ...JSON.parse(entryString) };
    return entry;
  } catch (_error: unknown) {
    console.error(
      `Error parsing key ${keyName} in required Type. Deleting existing key.`
    );
    await redisClient?.del(keyName);
    return;
  }
};

//generic function to write to cache
export const setToCache = async <T>(
  key: string,
  value: T,
  expiration: number = DEF_REDIS_CACHE_TIME
) => {
  if (!redisClient) {
    return;
  }
  try {
    const stringValue: string = JSON.stringify(value);
    const expires: boolean = !!expiration && expiration > 0;
    console.log('Set cache for key:', key);
    return await (expires
      ? redisClient.setEx(key, expiration, stringValue)
      : redisClient.set(key, stringValue));
  } catch (_error) {
    console.warn('There was an error stringing the key:', key);
    return;
  }
};

//to update the cache of the media entries
export const updateVotedMediaCache = async (
  ratingValues: MediaRatingUpdate,
  ratingEntry: RatingData
) => {
  if (!redisClient) {
    return;
  }
  const { mediaId, mediaType, userId, indexId, userScore, updatedAt } =
    ratingEntry;
  const mediaKey: string = getRedisMediaKey(mediaType, mediaId);
  const ratingKey: string = getRedisRatingKey(userId, indexId);

  const [mediaEntry, userRatingEntry]: [RedisMediaEntry, RedisRatingEntry] =
    await Promise.all([
      getFromCache<RedisMediaEntry>(mediaKey),
      getFromCache<RedisRatingEntry>(ratingKey),
    ]);
  if (!mediaEntry || !userRatingEntry) {
    return;
  }
  //we update the data on the media entry
  mediaEntry.rating = ratingValues.rating;
  mediaEntry.voteCount = ratingValues.voteCount;

  //and write the changes to cache
  setToCache(mediaKey, mediaEntry);
  console.log('Updated votes of media key:', mediaKey);

  //and we update the user rating itself
  userRatingEntry.userScore = userScore;
  userRatingEntry.updatedAt = updatedAt;

  //and also write it to cache
  setToCache(ratingKey, mediaEntry);
  console.log('Updated votes of user rating key:', ratingKey);
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
  return await setToCache(req.activeRedisKey, value, expiration);
};

//a specific cache setter for media that strips
//user sensitive data gathered in the first fetch
export const setMediaActiveCache = async (
  req: Request,
  media: FilmResponse | ShowResponse | SeasonResponse,
  expiration: number | undefined = DEF_REDIS_CACHE_TIME
): Promise<void | string | null> => {
  media.userRating = undefined;
  return await setActiveCache(req, media, expiration);
};
