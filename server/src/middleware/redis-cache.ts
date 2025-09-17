//an automated middleware that reads from the redis cache and returns
//the according data in the correct type, if existing.
//If not, we store the key in req.activeRedisKey for later use

import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../util/config';

export const useCache = <T>(key: string, param?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!redisClient) {
      return next();
    }
    const paramContent: string | null = param
      ? (req.params[param] ?? null)
      : null;
    const keyName: string = !paramContent ? key : `${key}:${paramContent}`;
    const cachedString: string | null | undefined =
      await redisClient.get(keyName);
    if (cachedString) {
      try {
        const cachedData: T = JSON.parse(cachedString);
        if (cachedData) {
          console.log('Read data from key', keyName);
          return res.json(cachedData);
        }
      } catch (error) {
        console.error('Error parsing Cache:', error);
        await redisClient.del(keyName);
      }
    }
    req.activeRedisKey = keyName;
    return next();
  };
};
