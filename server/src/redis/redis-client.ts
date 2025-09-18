import { createClient, RedisClientType } from 'redis';
import { Request } from 'express';
import { redisClient } from '../util/config';
import {
  DEF_REDIS_CACHE_TIME,
  REDIS_ENABLED,
} from '../constants/redis-constants';

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
