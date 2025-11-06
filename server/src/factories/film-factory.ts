import { getYearNum } from '../../../shared/helpers/format-helper';
import { isUnreleased } from '../../../shared/helpers/media-helper';
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

export const createFilm = (tmdb: TMDBFilmData): FilmData => {
  return {
    ...DEF_FILM,
    ...createTMDBMediaBase(tmdb),
    name: tmdb.title,
    sortName: tmdb.title.trim(),
    originalName: tmdb.original_title,
    releaseDate: getAirDate(tmdb.release_date),
    runtime: tmdb.runtime,
  };
};

export const createIndexForFilm = (tmdb: TMDBIndexFilm): CreateIndexMedia => {
  //to avoid adding a baseRating because of TMDB for some reason allowing people to vote before
  //release date, we have to do all this.
  const releaseDate: string | null = getAirDate(tmdb.release_date);
  const unreleased: boolean = isUnreleased(releaseDate);
  //to overwrite the possible baseRating.

  const base = createTMDBIndexBase(tmdb);
  const correctedRating: number | undefined = unreleased ? 0 : undefined;

  return {
    ...base,
    name: tmdb.title,
    addedToMedia: false,
    year: getYearNum(releaseDate),
    releaseDate,
    mediaType: MediaType.Film,
    baseRating: correctedRating ?? base.baseRating,
    rating: correctedRating ?? base.rating,
    voteCount: unreleased ? 0 : base.voteCount,
  };
};

export const createIndexForFilmBulk = (
  tmdbs: TMDBIndexFilm[]
): CreateIndexMedia[] => tmdbs.map((t: TMDBIndexFilm) => createIndexForFilm(t));
