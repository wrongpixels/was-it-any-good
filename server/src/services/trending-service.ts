import {
  TMDBSearchSchema,
  TMDBIndexFilmArraySchema,
  TMDBIndexFilm,
  TMDBIndexShow,
  TMDBSearchResult,
  TMDBIndexShowArraySchema,
} from '../schemas/tmdb-index-media-schemas';
import { tmdbAPI } from '../util/config';
import { tmdbPaths } from '../util/url-helper';

export interface TMDBFilmSearchData extends TMDBSearchResult {
  films: TMDBIndexFilm[];
}
export interface TMDBShowSearchData extends TMDBSearchResult {
  shows: TMDBIndexShow[];
}
export type TMDBSearchData = TMDBFilmSearchData | TMDBFilmSearchData;

export const fetchTrendingFromTMDBAndParse = async (): Promise<
  [TMDBFilmSearchData | undefined, TMDBShowSearchData | undefined]
> => {
  const [filmResponse, showResponse] = await Promise.all([
    tmdbAPI.get<TMDBFilmSearchData>(tmdbPaths.trending.films()),
    tmdbAPI.get<TMDBShowSearchData>(tmdbPaths.trending.shows()),
  ]);

  let filmData: TMDBFilmSearchData | undefined;
  let showData: TMDBShowSearchData | undefined;

  if (filmResponse?.data) {
    const parsedResult = TMDBSearchSchema.parse(filmResponse.data);
    const parsedFilms = TMDBIndexFilmArraySchema.parse(parsedResult.results);
    filmData = { ...parsedResult, films: parsedFilms };
  }

  if (showResponse?.data) {
    const parsedResult = TMDBSearchSchema.parse(showResponse.data);
    const parsedShows = TMDBIndexShowArraySchema.parse(parsedResult.results);
    showData = { ...parsedResult, shows: parsedShows };
  }

  return [filmData, showData];
};
