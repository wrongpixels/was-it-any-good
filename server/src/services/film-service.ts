import { createFilm } from '../factories/MediaFactory';
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
import { TMDB_TOKEN } from '../util/config';
import axios from 'axios';
//import { mapTMDBGenres } from './genre-mapper';

const TMDB_URL = 'https://api.themoviedb.org/3/movie/';

const tmdbApi = axios.create({
  baseURL: TMDB_URL,
  headers: {
    Authorization: TMDB_TOKEN,
    'Content-Type': 'application/json',
  },
});

export const fetchFilm = async (id: string): Promise<TMDBFilmData> => {
  const filmRes = await tmdbApi.get(id);
  const creditsRes = await tmdbApi.get(`${id}/credits`);
  const filmInfoData: TMDBFilmInfoData = TMDBFilmInfoSchema.parse(filmRes.data);
  const creditsData: TMDBCreditsData = trimCredits(
    TMDBCreditsSchema.parse(creditsRes.data)
  );
  const filmData: TMDBFilmData = { ...filmInfoData, credits: creditsData };
  const actualFilmData: FilmData = createFilm(filmData);
  console.log(actualFilmData);
  return filmData;
};

const trimCredits = (credits: TMDBCreditsData): TMDBCreditsData => ({
  ...credits,
  cast: credits.cast.slice(0, 10),
  crew: credits.crew.filter((crewMember: TMDBCrewData) =>
    Object.values(TMDBAcceptedJobs).includes(crewMember.job as TMDBAcceptedJobs)
  ),
});
