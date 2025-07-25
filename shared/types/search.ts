import { MediaType } from './media';

export const mediaTypesToSearchTypes = (
  mediaTypes: MediaType[] | undefined | null
): (SearchType | null)[] | undefined => {
  if (!mediaTypes) {
    return undefined;
  }
  const validSearchTypes: SearchType[] = [];
  mediaTypes.forEach((m: MediaType) => {
    const searchType: SearchType | null | undefined = mediaTypeToSearchType(m);
    if (searchType) {
      validSearchTypes.push(searchType);
    }
  });
  return validSearchTypes;
};
export enum SearchType {
  Film = 'films',
  Show = 'shows',
  // Season = 'season',
  Person = 'people',
}
export const searchTypes: string[] = Object.values(SearchType);

export type TMDBSearchType = 'movie' | 'tv' | 'person' | 'multi';

export const isValidSearchType = (value: string): boolean =>
  searchTypes.includes(value);

export const mediaTypeToSearchType = (
  mediaType: MediaType | undefined
): SearchType | null | undefined => {
  switch (mediaType) {
    case MediaType.Film:
      return SearchType.Film;
    case MediaType.Show:
      return SearchType.Show;
    case MediaType.Season:
      return null;
    default:
      return null;
  }
};

export type OrderByType = 'popularity' | 'title' | 'year' | 'rating';
export type SortByType = 'desc' | 'asc';
