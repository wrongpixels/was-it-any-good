import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const POSTGRES_URI: string = process.env.POSTGRES_URI as string;
const PORT = parseInt(process.env.PORT || '6060', 10);
const TMDB_TOKEN: string = `Bearer ${process.env.API_TOKEN_TMDB}` as string;
const TMDB_API_URL: string = 'https://api.themoviedb.org/3';

if (!POSTGRES_URI) {
  throw new Error('Missing POSTGRES_URI');
}
if (!TMDB_TOKEN) {
  throw new Error('Missing TMDB_TOKEN');
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

export { POSTGRES_URI, PORT, tmdbAPI };
