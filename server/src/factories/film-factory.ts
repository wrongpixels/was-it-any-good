import imageLinker from '../services/image-linker';
import { TMDBFilmData } from '../schemas/film-schema';
import { mapTMDBGenres } from '../services/genre-mapper';
import { DEF_FILM } from '../types/media/media-defaults';
import { FilmData } from '../types/media/media-types';
import {
  createCast,
  createDirectors,
  createStudios,
  createWriters,
  getAirDate,
  validateCountries,
} from './media-factory';

export const createFilm = (tmdb: TMDBFilmData): FilmData => ({
  ...DEF_FILM,
  tmdbId: tmdb.id.toString(),
  imdbId: tmdb.imdb_id,
  name: tmdb.title,
  sortName: tmdb.title.trim(),
  countries: validateCountries(tmdb.origin_country),
  originalName: tmdb.original_title,
  description: tmdb.overview,
  releaseDate: getAirDate(tmdb.release_date),
  image: tmdb.poster_path
    ? imageLinker.createPosterURL(tmdb.poster_path)
    : DEF_FILM.image,
  runtime: tmdb.runtime,
  genres: mapTMDBGenres(tmdb.genres),
  directors: createDirectors(tmdb.credits.crew),
  writers: createWriters(tmdb.credits.crew),
  cast: createCast(tmdb.credits.cast),
  studios: createStudios(tmdb.production_companies),
});
