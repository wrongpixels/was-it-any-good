import { MediaType } from '../../../shared/types/media';
import { CreateIndexMedia } from '../../../shared/types/models';
import { DEF_FILM } from '../constants/media-defaults';
import { TMDBFilmData } from '../schemas/tmdb-film-schema';
import { TMDBIndexFilm } from '../schemas/tmdb-index-media-schemas';
import { FilmData } from '../types/media/media-types';
import {
  createTMDBIndexBase,
  createTMDBMediaBase,
  getAirDate,
} from './media-factory';

export const createFilm = (tmdb: TMDBFilmData): FilmData => ({
  ...DEF_FILM,
  ...createTMDBMediaBase(tmdb),
  name: tmdb.title,
  sortName: tmdb.title.trim(),
  originalName: tmdb.original_title,
  releaseDate: getAirDate(tmdb.release_date),
  runtime: tmdb.runtime,
});

export const createIndexFromFilm = (tmdb: TMDBIndexFilm): CreateIndexMedia => ({
  ...createTMDBIndexBase(tmdb),
  name: tmdb.title,
  popularity: tmdb.popularity,
  addedToMedia: false,
  mediaId: null,
  mediaType: MediaType.Film,
  rating: 0,
  voteCount: tmdb.vote_average > 0 ? 1 : 0,
});
