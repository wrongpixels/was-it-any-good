//an automated middleware that reads from the redis cache and returns
//the according data in the correct type, if existing.
//If not, we store the key in req.activeRedisKey for later use

import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../util/config';

export const useCache = <T>(customKey?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!redisClient) {
      return next();
    }

    //we use custom key or generate from method + URL
    const keyName: string = customKey || `${req.method}:${req.originalUrl}`;
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
