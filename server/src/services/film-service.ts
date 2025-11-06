import { AxiosResponse } from 'axios';
import { FilmResponse } from '../../../shared/types/models';
import { createFilm } from '../factories/film-factory';
import { IndexMedia } from '../models';
import Film, { CreateFilm } from '../models/media/film';
import { TMDBFilmInfoSchema } from '../schemas/tmdb-film-schema';
import { TMDBCreditsData } from '../schemas/tmdb-media-schema';
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
import { isUnreleased } from '../../../shared/helpers/media-helper';

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
  const filmRes: AxiosResponse = await tmdbAPI.get(
    tmdbPaths.films.withCredits(tmdbId)
  );
  //we extract credits from the rest of the film data
  const { credits, ...filmInfoData } = TMDBFilmInfoSchema.parse(filmRes.data);
  //we trim and format the credits
  const creditsData: TMDBCreditsData = trimCredits(credits);
  //and build the final FilmData object for our db
  const actualFilmData: FilmData = createFilm({
    ...filmInfoData,
    credits: creditsData,
  });
  return actualFilmData;
};

export const buildFilm = (filmData: FilmData, indexId: number): CreateFilm => {
  //because TMDB for some reason allows people to vote before release date, we have to do this mess
  //to avoid setting an early baseRating and rating.
  const releaseDate: string | null = filmData.releaseDate;
  const unreleased: boolean = isUnreleased(releaseDate);
  //to overwrite the possible baseRating.
  const correctedRating: number | undefined = unreleased ? 0 : undefined;
  return {
    ...filmData,
    indexId,
    imdbId: filmData.imdbId ? filmData.imdbId : undefined,
    releaseDate: filmData.releaseDate,
    country: filmData.countries,
    parentalGuide: null,
    baseRating: correctedRating ?? filmData.baseRating,
    rating: correctedRating ?? filmData.rating,
    voteCount: unreleased ? 0 : filmData.voteCount,
  };
};
