import { Transaction } from 'sequelize';
import { createFilm } from '../factories/film-factory';
import { MediaGenre, MediaRole } from '../models';
import Film, { CreateFilm } from '../models/film';
import {
  TMDBFilmInfoData,
  TMDBFilmData,
  TMDBFilmInfoSchema,
} from '../schemas/tmdb-film-schema';
import {
  TMDBAcceptedJobs,
  TMDBCreditsData,
  TMDBCreditsSchema,
  TMDBCrewData,
} from '../schemas/tmdb-media-schema';
import { FilmData } from '../types/media/media-types';
import { tmdbAPI } from '../util/config';
import CustomError from '../util/customError';
import { buildCredits, buildGenres } from './media-service';

export const buildFilmEntry = async (
  tmdbId: string,
  transaction: Transaction
): Promise<Film | null> => {
  const filmData: FilmData = await fetchTMDBFilm(tmdbId);
  let filmEntry: Film | null = await Film.create(buildFilm(filmData), {
    transaction,
  });
  if (!filmEntry) {
    throw new CustomError('Film could not be created', 400);
  }
  const filmId = filmEntry.id;
  console.log('Created film!');
  const genres: MediaGenre[] | null = await buildGenres(
    filmData,
    filmId,
    filmData.type,
    transaction
  );
  if (!genres) {
    throw new CustomError('Error creating genres', 400);
  }
  const credits: MediaRole[] | null = await buildCredits(
    filmData,
    filmId,
    transaction
  );
  if (!credits) {
    throw new CustomError('Error creating credits', 400);
  }
  filmEntry = await Film.scope('withCredits').findByPk(filmId, { transaction });
  if (!filmEntry) {
    throw new CustomError('Error gathering just created Film', 400);
  }
  return filmEntry;
};

export const fetchTMDBFilm = async (id: string): Promise<FilmData> => {
  const filmRes = await tmdbAPI.get(`/movie/${id}`);
  const creditsRes = await tmdbAPI.get(`/movie/${id}/credits`);

  const filmInfoData: TMDBFilmInfoData = TMDBFilmInfoSchema.parse(filmRes.data);
  const creditsData: TMDBCreditsData = trimCredits(
    TMDBCreditsSchema.parse(creditsRes.data)
  );
  const filmData: TMDBFilmData = { ...filmInfoData, credits: creditsData };
  const actualFilmData: FilmData = createFilm(filmData);

  return actualFilmData;
};

const trimCredits = (credits: TMDBCreditsData): TMDBCreditsData => ({
  ...credits,
  cast: credits.cast.slice(0, 10),
  crew: credits.crew.filter((crewMember: TMDBCrewData) =>
    Object.values(TMDBAcceptedJobs).includes(crewMember.job as TMDBAcceptedJobs)
  ),
});

export const buildFilm = (filmData: FilmData): CreateFilm => ({
  ...filmData,
  releaseDate: filmData.releaseDate.date || 'Unknown',
  country: filmData.countries,
  rating: 0,
  voteCount: 0,
  parentalGuide: null,
});
