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
import { getFromCache } from '../util/redis-helpers';
import { RedisMediaEntry, RedisRatingEntry } from '../types/redis-types';

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
        const ratingKey: string = getRedisRatingKey(
          req.activeUser?.id,
          entry.indexId
        );
        const userRating: RedisRatingEntry =
          await getFromCache<RedisRatingEntry>(ratingKey);
        if (userRating) {
          //and we set it in the entry we'll return
          entry.userRating = userRating;
        }
      }
      return res.json(entry);
    }
    //if not, we load the created keyName in req for later use in the controller
    req.activeRedisKey = keyName;
    return next();
  };
};
