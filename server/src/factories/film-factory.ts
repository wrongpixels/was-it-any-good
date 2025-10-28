import { getYearNum } from '../../../shared/helpers/format-helper';
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

export const createIndexForFilm = (tmdb: TMDBIndexFilm): CreateIndexMedia => ({
  ...createTMDBIndexBase(tmdb),
  name: tmdb.title,
  addedToMedia: false,
  year: getYearNum(tmdb.release_date),
  releaseDate: tmdb.release_date,
  mediaType: MediaType.Film,
});

export const createIndexForFilmBulk = (
  tmdbs: TMDBIndexFilm[]
): CreateIndexMedia[] => tmdbs.map((t: TMDBIndexFilm) => createIndexForFilm(t));
