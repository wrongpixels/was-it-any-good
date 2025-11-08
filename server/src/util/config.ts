import axios from 'axios';
import https from 'https';
import { TMDB_API_URL } from '../constants/url-constants';
import { RedisClientType } from 'redis';
import { initializeRedis } from '../redis/redis-client';

export enum ProductionMode {
  None = 0,
  Deployment = 1,
  Local = 2,
}

const NODE_ENV: string = process.env.NODE_ENV || '';
const PRODUCTION_MODE: ProductionMode =
  NODE_ENV === 'production'
    ? ProductionMode.Deployment
    : NODE_ENV === 'local-production'
      ? ProductionMode.Local
      : ProductionMode.None;
const PRODUCTION: boolean = PRODUCTION_MODE !== ProductionMode.None;
const POSTGRES_URI: string =
  !PRODUCTION && process.env.LOCAL_POSTGRES_URI
    ? process.env.LOCAL_POSTGRES_URI
    : process.env.POSTGRES_URI || '';
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

//TMDB broke something and now we have to force IPv4...
const httpsAgent: https.Agent = new https.Agent({ family: 4 });

const tmdbAPI = axios.create({
  baseURL: TMDB_API_URL,
  httpsAgent,
  headers: {
    Authorization: `Bearer ${API_TOKEN_TMDB}`,
    'Content-Type': 'application/json',
  },
});

export {
  POSTGRES_URI,
  REDIS_URI,
  redisClient,
  PORT,
  tmdbAPI,
  API_SECRET,
  PRODUCTION,
  PRODUCTION_MODE,
  NODE_ENV,
};
