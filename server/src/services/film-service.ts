import { createFilm } from '../factories/film-factory';
import { CreateFilm } from '../models/film';
import {
  TMDBAcceptedJobs,
  TMDBCreditsData,
  TMDBCreditsSchema,
  TMDBCrewData,
  TMDBFilmInfoData,
  TMDBFilmData,
  TMDBFilmInfoSchema,
} from '../schemas/film-schema';
import { FilmData } from '../types/media/media-types';
import { tmdbAPI } from '../util/config';

export const fetchFilm = async (id: string): Promise<FilmData> => {
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
  imdbId: filmData.imdbId,
  tmdbId: filmData.tmdbId,
  name: filmData.name,
  originalName: filmData.originalName,
  sortName: filmData.sortName,
  description: filmData.description,
  status: filmData.status,
  releaseDate: filmData.releaseDate.date || 'Unknown',
  country: filmData.countries,
  image: filmData.image,
  rating: 0,
  voteCount: 0,
  runtime: filmData.runtime,
  parentalGuide: null,
});
