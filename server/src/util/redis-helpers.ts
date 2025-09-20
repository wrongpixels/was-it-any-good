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
import { MediaType } from '../../../shared/types/media';

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
    const entry: T | undefined = JSON.parse(entryString);
    console.log('Got cache for key:', keyName);
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
  const { mediaId, mediaType, userId, indexId } = ratingEntry;
  const mediaKey: string = getRedisMediaKey(mediaType, mediaId);
  const ratingKey: string = getRedisRatingKey(userId, indexId);

  const mediaEntry: RedisMediaEntry =
    await getFromCache<RedisMediaEntry>(mediaKey);

  if (!mediaEntry) {
    return;
  }
  //we update the data on the media entry
  mediaEntry.rating = ratingValues.rating;
  mediaEntry.voteCount = ratingValues.voteCount;

  //and write the changes to cache
  setToCache<RedisMediaEntry>(mediaKey, mediaEntry);
  console.log('Updated votes of media key:', mediaKey);

  //and set the new rating to cache
  setToCache<RedisRatingEntry>(ratingKey, ratingEntry);
  console.log('Updated votes of user rating key:', ratingKey);
};

export const setActiveCache = async <T>(
  req: Request,
  value: T,
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
  return await setToCache<T>(req.activeRedisKey, value, expiration);
};

//a specific cache setter for media that strips
//user sensitive data gathered in the first fetch
export const setMediaCache = async (
  req: Request,
  media: FilmResponse | ShowResponse | SeasonResponse,
  expiration: number | undefined = DEF_REDIS_CACHE_TIME,
  useActive: boolean = false
): Promise<void | string | null> => {
  //if there was a activeUser, we cache either the rating or null
  if (req.activeUser?.isValid) {
    const ratingKey: string = getRedisRatingKey(
      req.activeUser.id,
      media.indexId
    );
    //we cache null to know we already checked for this user's vote
    setToCache<RatingData | null>(ratingKey, media.userRating ?? null);
  }
  //we ensure we don't cache userRating in main media
  media.userRating = undefined;

  //and in seasons if it's a show. We also create the cache entry for them

  if (media.mediaType === MediaType.Show && media.seasons) {
    media.seasons = media.seasons.map((s: SeasonResponse) => {
      if (req.activeUser?.isValid) {
        const seasonRatingKey: string = getRedisRatingKey(
          req.activeUser.id,
          s.indexId
        );
        setToCache<RatingData | null>(seasonRatingKey, s.userRating ?? null);
      }
      return { ...s, userRating: undefined };
    });
  }

  //and set the corresponding key
  if (useActive) {
    return await setActiveCache<FilmResponse | ShowResponse | SeasonResponse>(
      req,
      media,
      expiration
    );
  }
  return await setToCache<FilmResponse | ShowResponse | SeasonResponse>(
    getRedisMediaKey(media.mediaType, media.id),
    media,
    expiration
  );
};

//a specific cache setter for active media in the request
export const setMediaActiveCache = async (
  req: Request,
  media: FilmResponse | ShowResponse | SeasonResponse,
  expiration: number | undefined = DEF_REDIS_CACHE_TIME
): Promise<void | string | null> => {
  return await setMediaCache(req, media, expiration, true);
};
