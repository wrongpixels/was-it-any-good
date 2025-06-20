import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const POSTGRES_URI: string = process.env.POSTGRES_URI || '';
const TMDB_API_URL: string = 'https://api.themoviedb.org/3';
const TMDB_MEDIA_URL: string = 'https://media.themoviedb.org/t/p';

const PORT: number = parseInt(process.env.PORT || '6060', 10);
const API_SECRET: string = process.env.API_SECRET || '';
const TMDB_TOKEN: string = `Bearer ${process.env.API_TOKEN_TMDB}` as string;

if (!POSTGRES_URI) {
  throw new Error('Missing POSTGRES_URI');
}
if (!TMDB_TOKEN) {
  throw new Error('Missing TMDB_TOKEN');
}
if (!API_SECRET) {
  throw new Error('Missing API_SECRET');
}
if (isNaN(PORT)) {
  throw new Error('PORT must be a number.');
}

const tmdbAPI = axios.create({
  baseURL: TMDB_API_URL,
  headers: {
    Authorization: TMDB_TOKEN,
    'Content-Type': 'application/json',
  },
});

export { POSTGRES_URI, PORT, tmdbAPI, TMDB_MEDIA_URL, API_SECRET };
