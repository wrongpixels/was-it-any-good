import { createClient, RedisClientType } from 'redis';
import { Request } from 'express';
import { redisClient } from '../util/config';

export const initializeRedis = (URI: string): RedisClientType | undefined => {
  // we skip the setup if no valid REDIS URI

  if (URI) {
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
  return undefined;
};

export const setCurrentKey = async (
  req: Request,
  value: unknown,
  //expire in 1 hour by default. Undefined or setting <= 0 means no expiration
  expiration: number | undefined = 6000
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
  return await (expires
    ? redisClient.setEx(req.activeRedisKey, expiration, stringData)
    : redisClient.set(req.activeRedisKey, stringData));
};
