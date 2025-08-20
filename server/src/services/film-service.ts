import { FilmResponse } from '../../../shared/types/models';
import { createFilm } from '../factories/film-factory';
import { IndexMedia } from '../models';
import Film, { CreateFilm } from '../models/media/film';
import {
  TMDBFilmInfoData,
  TMDBFilmData,
  TMDBFilmInfoSchema,
} from '../schemas/tmdb-film-schema';
import {
  TMDBCreditsData,
  TMDBFilmCreditsSchema,
} from '../schemas/tmdb-media-schema';
import { FilmData, MediaQueryValues } from '../types/media/media-types';
import { tmdbAPI } from '../util/config';
import CustomError from '../util/customError';
import { toPlain } from '../util/model-helpers';
import { trimCredits } from '../util/tmdb-credits-formatter';
import { tmdbPaths } from '../util/url-helper';
import {
  upsertIndexMedia,
  mediaDataToCreateIndexMedia,
} from './index-media-service';
import { buildCreditsAndGenres } from './media-service';

export const buildFilmEntry = async (
  params: MediaQueryValues
): Promise<FilmResponse | null> => {
  const filmData: FilmData = await fetchTMDBFilm(params.mediaId);

  //we first use the data to build or update the matching indexMedia via upsert
  //we could findOrCreate, but setting fresh data is preferred

  const indexMedia: IndexMedia | null = await upsertIndexMedia(
    mediaDataToCreateIndexMedia(filmData),
    params.transaction
  );
  if (!indexMedia?.id) {
    throw new CustomError('Error creating Index Media', 400);
  }
  const { scopeOptions, findOptions } = Film.buildMediaQueryOptions(params);
  const indexId = indexMedia.id;
  const filmEntry: Film | null = await Film.scope(scopeOptions).create(
    buildFilm(filmData, indexId),
    {
      transaction: params.transaction,
    }
  );
  if (!filmEntry) {
    throw new CustomError('Film could not be created', 400);
  }
  console.log('Created film!');
  await buildCreditsAndGenres(filmEntry, filmData, params.transaction);
  //we reload after creating the credits and season associations so the final entry is populated
  await filmEntry.reload({ ...findOptions });
  return toPlain(filmEntry);
};

export const fetchTMDBFilm = async (
  tmdbId: string | number
): Promise<FilmData> => {
  const [filmRes, creditsRes] = await Promise.all([
    tmdbAPI.get(tmdbPaths.films.byTMDBId(tmdbId)),
    tmdbAPI.get(tmdbPaths.films.credits(tmdbId)),
  ]);
  const filmInfoData: TMDBFilmInfoData = TMDBFilmInfoSchema.parse(filmRes.data);
  const creditsData: TMDBCreditsData = trimCredits(
    TMDBFilmCreditsSchema.parse(creditsRes.data)
  );
  const filmData: TMDBFilmData = { ...filmInfoData, credits: creditsData };
  const actualFilmData: FilmData = createFilm(filmData);
  return actualFilmData;
};

export const buildFilm = (filmData: FilmData, indexId: number): CreateFilm => ({
  ...filmData,
  indexId,
  imdbId: filmData.imdbId ? filmData.imdbId : undefined,
  releaseDate: filmData.releaseDate,
  country: filmData.countries,
  parentalGuide: null,
});
