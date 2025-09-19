import { createClient, RedisClientType } from 'redis';
import { REDIS_ENABLED } from '../constants/redis-constants';

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
