import dotenv from 'dotenv';
dotenv.config();

const POSTGRES_URI: string = process.env.POSTGRES_URI as string;
const PORT = parseInt(process.env.PORT || '6060', 10);
const TMDB_TOKEN: string = `Bearer ${process.env.API_TOKEN_TMDB}` as string;
const TVDB_TOKEN: string = `Bearer ${process.env.API_TOKEN_TVDB}` as string;

if (!POSTGRES_URI) {
  throw new Error('Missing POSTGRES_URI');
}
if (!TMDB_TOKEN) {
  throw new Error('Missing TMDB_TOKEN');
}
if (!TVDB_TOKEN) {
  throw new Error('Missing TVDB_TOKEN');
}
if (isNaN(PORT)) {
  throw new Error('PORT must be a number.');
}

export { POSTGRES_URI, PORT, TMDB_TOKEN, TVDB_TOKEN };
