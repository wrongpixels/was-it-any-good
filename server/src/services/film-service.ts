import { Transaction } from 'sequelize';
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
import { FilmData } from '../types/media/media-types';
import { tmdbAPI } from '../util/config';
import CustomError from '../util/customError';
import { buildCreditsAndGetEntry, trimCredits } from './media-service';

export const buildFilmEntry = async (
  tmdbId: string,
  transaction: Transaction
): Promise<Film | null> => {
  const filmData: FilmData = await fetchTMDBFilm(tmdbId);
  const filmEntry: Film | null = await Film.create(buildFilm(filmData), {
    transaction,
  });
  if (!filmEntry) {
    throw new CustomError('Film could not be created', 400);
  }
  console.log('Created film!');
  return await buildCreditsAndGetEntry(filmEntry, filmData, transaction);
};

export const fetchTMDBFilm = async (tmdbId: string): Promise<FilmData> => {
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
  releaseDate: filmData.releaseDate,
  country: filmData.countries,
  rating: 0,
  voteCount: filmData.baseRating > 0 ? 1 : 0,
  parentalGuide: null,
});
