import { TMDB_TOKEN } from '../util/config';
import axios from 'axios';

const TMDB_URL = 'https://api.themoviedb.org/3/movie/';

const tmdbApi = axios.create({
  baseURL: TMDB_URL,
  headers: {
    Authorization: TMDB_TOKEN,
    'Content-Type': 'application/json',
  },
});

export const fetchFilm = async (id: string): Promise<unknown> => {
  const res = await tmdbApi.get(id);
  console.log('TMDB Response Structure:', JSON.stringify(res.data, null, 2));
  return res.data;
};
