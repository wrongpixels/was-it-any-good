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

export const arrayToTMDBSearchTypes = (array: string[]) => {
  const tmdbSearchTypes: TMDBSearchType[] = [];

  if (array.includes(SearchType.Film)) {
    tmdbSearchTypes.push('movie');
  }
  if (array.includes(SearchType.Show)) {
    const movieIndex = tmdbSearchTypes.indexOf('movie');
    if (movieIndex !== -1) {
      tmdbSearchTypes.splice(movieIndex, 1);
      tmdbSearchTypes.push('multi');
    } else {
      tmdbSearchTypes.push('tv');
    }
  }
  if (array.includes(SearchType.Person)) {
    tmdbSearchTypes.push('person');
  }
  return tmdbSearchTypes;
};
