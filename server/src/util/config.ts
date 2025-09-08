import axios from 'axios';
import { TMDB_API_URL } from '../constants/url-constants';

const POSTGRES_URI: string = process.env.POSTGRES_URI || '';
const API_SECRET: string = process.env.API_SECRET || '';
const apiTokenTmdb: string = process.env.API_TOKEN_TMDB || '';
const PORT: number = parseInt(process.env.PORT || '6060', 10);

if (!POSTGRES_URI) {
  throw new Error("Missing 'POSTGRES_URI' variable in 'server/.env'");
}
if (!API_SECRET) {
  throw new Error("Missing 'API_SECRET' variable in 'server/.env'");
}
if (!apiTokenTmdb) {
  throw new Error("Missing 'API_TOKEN_TMDB' variable in 'server/.env'");
}
if (isNaN(PORT)) {
  throw new Error("'PORT' variable in 'server/.env' must be a number.");
}

const tmdbAPI = axios.create({
  baseURL: TMDB_API_URL,
  headers: {
    Authorization: `Bearer ${apiTokenTmdb}`,
    'Content-Type': 'application/json',
  },
});

export { POSTGRES_URI, PORT, tmdbAPI, API_SECRET };
