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
  MediaResponse,
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
  ratingEntry: RatingData,
  showId?: number
) => {
  console.log('UPDATING a', ratingEntry.mediaType);
  if (!redisClient) {
    return;
  }
  const { mediaId, mediaType, userId, indexId } = ratingEntry;

  //if it's a season, we get the full show entry that owns it, if not, the media linked to
  const mediaKey: string = getRedisMediaKey(
    showId ? MediaType.Show : mediaType,
    showId ?? mediaId
  );
  const ratingKey: string = getRedisRatingKey(userId, indexId);

  const mediaEntry: RedisMediaEntry =
    await getFromCache<RedisMediaEntry>(mediaKey);

  if (!mediaEntry) {
    console.log("Couldn't find key:", mediaKey);
    return;
  }
  //we update the data on the media entry

  //if it's a season, we have to edit the season inside the show cache
  if (
    ratingEntry.mediaType === MediaType.Season &&
    mediaEntry.mediaType === MediaType.Show
  ) {
    const season: SeasonResponse | undefined = mediaEntry.seasons?.find(
      (s: SeasonResponse) => s.indexId === indexId
    );
    if (!season) {
      return;
    }
    season.rating = ratingValues.rating;
    season.voteCount = ratingValues.voteCount;
  }

  //if not, we just update the entry's data
  else {
    mediaEntry.rating = ratingValues.rating;
    mediaEntry.voteCount = ratingValues.voteCount;
  }

  //and write the changes to cache
  await Promise.allSettled([
    setToCache<RedisMediaEntry>(mediaKey, mediaEntry),
    setToCache<RedisRatingEntry>(ratingKey, ratingEntry),
  ]);
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
): Promise<void> => {
  //we create 2 maps with the key and the data to set, 1 for ratings and other
  //for the media to set
  const mediaPairs: [string, MediaResponse | SeasonResponse][] = [];
  const ratingPairs: [string, RatingData | null][] = [];

  //if there was an activeUser, we cache either the rating or null
  if (req.activeUser?.isValid) {
    ratingPairs.push([
      getRedisRatingKey(req.activeUser.id, media.indexId),
      media.userRating ?? null,
    ]);
  }
  //we ensure we don't cache userRating in main media
  media.userRating = undefined;

  //if it's a show, we also create the cache entries for them

  if (media.mediaType === MediaType.Show && media.seasons) {
    media.seasons = media.seasons.map((s: SeasonResponse) => {
      if (req.activeUser?.isValid) {
        const seasonRatingKey: string = getRedisRatingKey(
          req.activeUser.id,
          s.indexId
        );
        //currently, we don't cache season data, it's more efficient to store them inside the show.
        //we also avoid conflicting expirations
        //mediaPairs.push([getRedisMediaKey(MediaType.Season, s.id), s]);
        ratingPairs.push([seasonRatingKey, s.userRating ?? null]);
      }
      return { ...s, userRating: undefined };
    });
  }
  //we set the appropriate media key
  if (useActive && req.activeRedisKey) {
    mediaPairs.push([req.activeRedisKey, media]);
  } else {
    mediaPairs.push([getRedisMediaKey(media.mediaType, media.id), media]);
  }
  //and we cache all in parallel through a Promise.allSettled
  const promises: Promise<string | null | undefined>[] = [
    ...ratingPairs.map((r) =>
      setToCache<RatingData | null>(r[0], r[1], expiration)
    ),
    ...mediaPairs.map((m) =>
      setToCache<MediaResponse | SeasonResponse>(m[0], m[1], expiration)
    ),
  ];
  try {
    const results = await Promise.allSettled(promises);
    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      console.error(
        `Failed to cache ${failed.length}/${promises.length} items:`,
        failed.map((r) => r.reason)
      );
    }
  } catch (error) {
    console.error('Batch cache error:', error);
  }
};

//a specific cache setter for active media in the request
export const setMediaActiveCache = async (
  req: Request,
  media: FilmResponse | ShowResponse | SeasonResponse,
  expiration: number | undefined = DEF_REDIS_CACHE_TIME
): Promise<void | string | null> => {
  return await setMediaCache(req, media, expiration, true);
};
