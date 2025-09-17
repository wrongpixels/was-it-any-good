import axios from 'axios';
import { TMDB_API_URL } from '../constants/url-constants';
import { RedisClientType } from 'redis';
import { initializeRedis } from '../redis/redis-client';

const POSTGRES_URI: string = process.env.POSTGRES_URI || '';
const REDIS_URI: string = process.env.REDIS_URI || '';
const API_SECRET: string = process.env.API_SECRET || '';
const API_TOKEN_TMDB: string = process.env.API_TOKEN_TMDB || '';

const PORT: number = parseInt(process.env.PORT || '6060', 10);

if (!POSTGRES_URI) {
  throw new Error("⛔  Missing 'POSTGRES_URI' variable in 'server/.env'");
}
if (!REDIS_URI) {
  console.warn(
    "⚠️  Missing 'REDIS_URI' variable in 'server/.env'!",
    'WIAG can work without it, but server cache features will not be available.'
  );
}
if (!API_SECRET) {
  throw new Error("⛔  Missing 'API_SECRET' variable in 'server/.env'");
}
if (!API_TOKEN_TMDB) {
  throw new Error("⛔  Missing 'API_TOKEN_TMDB' variable in 'server/.env'");
}
if (isNaN(PORT)) {
  throw new Error("⛔  'PORT' variable in 'server/.env' must be a number.");
}

const redisClient: RedisClientType | undefined = initializeRedis(REDIS_URI);

const tmdbAPI = axios.create({
  baseURL: TMDB_API_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN_TMDB}`,
    'Content-Type': 'application/json',
  },
});

export { POSTGRES_URI, REDIS_URI, redisClient, PORT, tmdbAPI, API_SECRET };
