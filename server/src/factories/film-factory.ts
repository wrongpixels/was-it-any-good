import { TMDBFilmData } from '../schemas/tmdb-film-schema';
import { DEF_FILM } from '../types/media/media-defaults';
import { FilmData } from '../types/media/media-types';
import { createTMDBBase, getAirDate } from './media-factory';

export const createFilm = (tmdb: TMDBFilmData): FilmData => ({
  ...DEF_FILM,
  ...createTMDBBase(tmdb),
  name: tmdb.title,
  sortName: tmdb.title.trim(),
  originalName: tmdb.original_title,
  releaseDate: getAirDate(tmdb.release_date),
  runtime: tmdb.runtime,
});
