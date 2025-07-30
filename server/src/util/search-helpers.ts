import { SearchType, TMDBSearchType } from '../../../shared/types/search';

export const extractQuery = (param: string | unknown | undefined): string[] => {
  return Array.isArray(param)
    ? param
        .map(String)
        .filter((item): item is string => typeof item === 'string')
    : typeof param === 'string'
    ? [param]
    : [];
};

export const arrayToTMDBSearchTypes = (array: string[]): TMDBSearchType[] => {
  if (!array || array.length === 0) {
    return [TMDBSearchType.Multi];
  }
  const hasFilm = array.includes(SearchType.Film);
  const hasShow = array.includes(SearchType.Show);
  const hasPerson = array.includes(SearchType.Person);

  const tmdbSearchTypes: TMDBSearchType[] = [];

  if (hasFilm && hasShow) {
    tmdbSearchTypes.push(TMDBSearchType.Multi);
  } else {
    if (hasFilm) {
      tmdbSearchTypes.push(TMDBSearchType.Movie);
    }
    if (hasShow) {
      tmdbSearchTypes.push(TMDBSearchType.TV);
    }
  }
  if (hasPerson) {
    tmdbSearchTypes.push(TMDBSearchType.Person);
  }

  return tmdbSearchTypes;
};
