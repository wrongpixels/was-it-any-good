import {
  TMDBAcceptedJobs,
  TMDBCastData,
  TMDBCrewData,
  TMDBFilmData,
} from '../types/media/tmdb-types';
import { TMDB_TOKEN } from '../util/config';
import axios from 'axios';

const TMDB_URL = 'https://api.themoviedb.org/3/movie/';

const tmdbApi = axios.create({
  baseURL: TMDB_URL,
  headers: {
    Authorization: TMDB_TOKEN,
    'Content-Type': 'application/json',
  },
});

export const fetchFilm = async (id: string): Promise<TMDBFilmData> => {
  const basicData = await tmdbApi.get(id);
  const creditsData = await tmdbApi.get(`${id}/credits`);

  const filmData: TMDBFilmData = {
    id: basicData.data.id,
    genres: basicData.data.genres,
    imdb_id: basicData.data.imdb_id,
    origin_country: basicData.data.production_countries,
    title: basicData.data.title,
    original_title: basicData.data.original_title,
    overview: basicData.data.overview,
    poster_path: basicData.data.poster_path,
    release_date: basicData.data.release_date,
    runtime: basicData.data.runtime,
    status: basicData.data.status,
    adult: basicData.data.adult,
    credits: {
      id: creditsData.data.id,
      cast: creditsData.data.cast
        .slice(0, 10)
        .map((castMember: TMDBCastData) => ({
          id: castMember.id,
          name: castMember.name,
          order: castMember.order,
        })),
      crew: creditsData.data.crew
        .filter((crewMember: TMDBCrewData) =>
          Object.values(TMDBAcceptedJobs).includes(
            crewMember.job as TMDBAcceptedJobs
          )
        )
        .map((crewMember: TMDBCrewData) => ({
          id: crewMember.id,
          name: crewMember.name,
          job: crewMember.job,
        })),
    },
  };

  return filmData;
};
