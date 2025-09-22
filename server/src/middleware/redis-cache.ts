//an automated middleware that reads from the redis cache and returns
//the according data in the correct type, if existing.
//If not, we store the key in req.activeRedisKey for later use

import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../util/config';
import { extractAllQueries } from '../util/url-query-extractor';
import { MediaType } from '../../../shared/types/media';
import {
  getRedisBaseKeyForMediaType,
  getRedisRatingKey,
} from '../constants/redis-constants';
import { getFromCache, setToCache } from '../util/redis-helpers';
import { RedisMediaEntry, RedisRatingEntry } from '../types/redis-types';
import { Rating } from '../models';
import { RatingData, SeasonResponse } from '../../../shared/types/models';
import { Op } from 'sequelize';

//the options we can use to automatize unique keys.
//allows url queries, parameters and linking the activeUser id ('ratings:user:123')
export interface CacheOptions {
  baseKey?: string;
  params?: string[];
  addActiveUser?: boolean;
  addQueries?: boolean;
  prefix?: string;
}

const getKeyNameFromRequest = (
  req: Request,
  options?: CacheOptions
): string => {
  if (!options?.baseKey) {
    //if no custom key, we use the url itself
    return `${req.method}:${req.originalUrl}`;
  }
  //we extract the params we provided as values
  const extractedParams: string[] = (options.params ?? [])
    .map((p) => req.params[p])
    .filter((p): p is string => !!p);
  const includeQueries: boolean = options.addQueries ?? false;
  //if addQueries, we extract them with our custom logic
  const extractedQueries: string[] = includeQueries
    ? extractAllQueries(req)
    : [];

  if (includeQueries) {
    console.log('Including queries:', extractedQueries);
  }
  //an optional prefix
  const prefix: string = options.prefix ?? '';

  //we add the user id
  const user: string =
    options.addActiveUser && req.activeUser?.isValid
      ? `user:${req.activeUser.id}`
      : '';

  //and we mount the final key
  const keyName: string = [
    prefix,
    options.baseKey,
    user,
    ...extractedParams,
    ...extractedQueries,
  ]
    .filter(Boolean)
    .join(':');
  return keyName;
};

export const useCache = <T>(options?: CacheOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!redisClient) {
      return next();
    }
    //if we need to link the active user and it's not available, we skip it, or
    //we would be linking the cache for all users
    if (options?.addActiveUser) {
      if (!req.activeUser?.isValid) {
        return next();
      }
    }

    //we use custom key or generate from method + URL
    const keyName: string = getKeyNameFromRequest(req, options);
    //we get and parse into the sent type the cached value from redis if exists
    const entry: T | undefined = await getFromCache<T>(keyName);
    if (entry) {
      return res.json(entry);
    }
    //if not, we load the created keyName in req for later use in the controller
    req.activeRedisKey = keyName;
    return next();
  };
};

//a version for media entries that also adds the cached active user rating before
//returning the final object.
//userRating is always empty in the cached media for security reasons
export const useMediaCache = (mediaType: MediaType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!redisClient) {
      return next();
    }
    //we use custom key or generate from method + URL
    const keyName: string = getKeyNameFromRequest(req, {
      baseKey: getRedisBaseKeyForMediaType(mediaType),
      params: ['id'],
    });
    //we get and parse into the sent type the cached value from redis if exists
    const entry: RedisMediaEntry = await getFromCache<RedisMediaEntry>(keyName);
    if (entry) {
      //if the active user is valid, we try to get their Rating for the media, if exists
      if (req.activeUser?.isValid) {
        const userId: number = req.activeUser.id;
        const indexId: number = entry.indexId;
        const ratingKeys: string[] = [];
        ratingKeys.push(getRedisRatingKey(userId, indexId));

        //if it's a show, we also need to gather the user's ratings
        //of the seasons
        if (entry.mediaType === MediaType.Show && entry.seasons) {
          entry.seasons.forEach((s: SeasonResponse) =>
            ratingKeys.push(getRedisRatingKey(userId, s.indexId))
          );
        }

        const promises: Promise<RedisRatingEntry | null>[] = ratingKeys.map(
          (r: string) => getFromCache<RedisRatingEntry>(r)
        );
        //we save the key and mediaRating of index0, as it's the one of the main media
        const [mediaRatingKey]: string[] = ratingKeys;
        const ratings: (RedisRatingEntry | null)[] =
          await Promise.all(promises);
        let mediaRating: RedisRatingEntry | null = ratings[0] ?? null;
        //if mediaRating is undefined, means it wasn't found. We need
        //to try to find at least once and assign a null so this only runs once.

        if (mediaRating === undefined) {
          try {
            mediaRating = await Rating.findOne({ where: { userId, indexId } });
            //we ensure we set it to valid or null
            setToCache<RatingData | null>(mediaRatingKey, mediaRating ?? null);
          } catch (dbError) {
            console.error(
              'DB fetch failed for rating key:',
              mediaRatingKey,
              dbError
            );
            mediaRating = null;
          }
        }

        if (mediaRating !== undefined) {
          //and we set it in the entry we'll return
          entry.userRating = mediaRating;
        }
        if (entry.mediaType === MediaType.Show && entry.seasons) {
          const seasonRatingMap: Map<number, RatingData | null> = new Map();
          const missingSeasonRatings: Map<number, RatingData | null> =
            new Map();
          entry.seasons.forEach((s: SeasonResponse, i: number) => {
            const rating: RedisRatingEntry | null = ratings[i + 1]; // Skip main rating index
            if (rating === undefined) {
              missingSeasonRatings.set(s.indexId, null);
            } else {
              seasonRatingMap.set(s.indexId, rating);
            }
          });
          if (missingSeasonRatings.size > 0) {
            try {
              const seasonRatingEntries: RatingData[] = await Rating.findAll({
                where: {
                  userId,
                  indexId: { [Op.in]: Array.from(missingSeasonRatings.keys()) },
                },
              });
              if (seasonRatingEntries.length > 0) {
                seasonRatingEntries.forEach((s: RatingData) => {
                  missingSeasonRatings.set(s.indexId, s);
                  seasonRatingMap.set(s.indexId, s);
                });
                //and we store in cache these new gathered ratings from db
                const seasonPromises: Promise<string | null | undefined>[] = [];
                missingSeasonRatings.forEach((rating, indexId) =>
                  seasonPromises.push(
                    setToCache<RatingData | null>(
                      getRedisRatingKey(userId, indexId),
                      rating
                    )
                  )
                );
                await Promise.allSettled(seasonPromises);
              }
            } catch (dbError) {
              console.error('DB fetch failed for season ratings:', dbError);
            }
            //and now, we assign all the gathered seasons according to our map.
            entry.seasons = entry.seasons.map((s: SeasonResponse) => ({
              ...s,
              userRating: seasonRatingMap.get(s.indexId),
            }));
          }
        }
      }
      return res.json(entry);
    }
    //if not, we load the created keyName in req for later use in the controller
    req.activeRedisKey = keyName;
    return next();
  };
};
