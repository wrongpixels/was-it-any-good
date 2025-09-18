//an automated middleware that reads from the redis cache and returns
//the according data in the correct type, if existing.
//If not, we store the key in req.activeRedisKey for later use

import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../util/config';
import { extractAllQueries } from '../util/url-query-extractor';

export interface CacheOptions {
  baseKey?: string;
  params?: string[];
  addQueries?: boolean;
  prefix?: string;
}

const getKeyName = (req: Request, options?: CacheOptions): string => {
  if (!options?.baseKey) {
    //if no custom key, we use the url itself
    return `${req.method}:${req.originalUrl.split('?')[0]}`;
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
  //an optional prefix
  const prefix: string = options.prefix ?? '';
  //and we mount the final key
  const keyName: string = [
    prefix,
    options.baseKey,
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

    //we use custom key or generate from method + URL
    const keyName: string = getKeyName(req, options);
    const cachedString: string | null | undefined =
      await redisClient.get(keyName);
    if (cachedString) {
      try {
        const cachedData: T = JSON.parse(cachedString);
        if (cachedData) {
          console.log('Cache found for key:', keyName);
          return res.json(cachedData);
        }
      } catch (error) {
        console.error('Error parsing cache:', error);
        await redisClient.del(keyName);
        return next();
      }
    }
    req.activeRedisKey = keyName;
    return next();
  };
};
