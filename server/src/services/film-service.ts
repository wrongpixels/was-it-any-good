import { createFilm } from '../factories/film-factory';
import Film, { CreateFilm } from '../models/media/film';
import {
  TMDBFilmInfoData,
  TMDBFilmData,
  TMDBFilmInfoSchema,
} from '../schemas/tmdb-film-schema';
import {
  TMDBCreditsData,
  TMDBCreditsSchema,
} from '../schemas/tmdb-media-schema';
import { FilmData, MediaQueryValues } from '../types/media/media-types';
import { tmdbAPI } from '../util/config';
import CustomError from '../util/customError';
import { buildCreditsAndGenres, trimCredits } from './media-service';

export const buildFilmEntry = async (
  params: MediaQueryValues
): Promise<Film | null> => {
  const filmData: FilmData = await fetchTMDBFilm(params.mediaId);
  const { scopeOptions, findOptions } = Film.buildMediaQueryOptions(params);
  const filmEntry: Film | null = await Film.scope(scopeOptions).create(
    buildFilm(filmData),
    {
      transaction: params.transaction,
    }
  );
  if (!filmEntry) {
    throw new CustomError('Film could not be created', 400);
  }
  console.log('Created film!');
  await buildCreditsAndGenres(filmEntry, filmData, params.transaction);
  return await filmEntry.reload(findOptions);
};

export const fetchTMDBFilm = async (
  tmdbId: string | number
): Promise<FilmData> => {
  const filmRes = await tmdbAPI.get(`/movie/${tmdbId}`);
  const creditsRes = await tmdbAPI.get(`/movie/${tmdbId}/credits`);

  const filmInfoData: TMDBFilmInfoData = TMDBFilmInfoSchema.parse(filmRes.data);
  const creditsData: TMDBCreditsData = trimCredits(
    TMDBCreditsSchema.parse(creditsRes.data)
  );
  const filmData: TMDBFilmData = { ...filmInfoData, credits: creditsData };
  const actualFilmData: FilmData = createFilm(filmData);

  return actualFilmData;
};

export const buildFilm = (filmData: FilmData): CreateFilm => ({
  ...filmData,
  imdbId: filmData.imdbId ? filmData.imdbId : undefined,
  releaseDate: filmData.releaseDate,
  country: filmData.countries,
  parentalGuide: null,
});
