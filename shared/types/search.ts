import { MediaType } from "./media";

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
  Film = "film",
  Show = "show",
  Person = "person",
  Season = "season",
  Multi = "multi",
}

export enum SearchDropDown {
  Films = "Films",
  Shows = "Shows",
  All = "All",
}

export const searchDropToType = (drop: SearchDropDown | string): SearchType => {
  switch (drop) {
    case SearchDropDown.All:
      return SearchType.Multi;
    case SearchDropDown.Films:
      return SearchType.Film;
    case SearchDropDown.Shows:
      return SearchType.Show;
    default:
      return SearchType.Multi;
  }
};

export const searchDropdownOptions: string[] = Object.values(SearchDropDown);

export const searchTypes: string[] = Object.values(SearchType);

export const arrayToSearchType = (array: string[]): SearchType | undefined => {
  const hasFilm = array.includes(SearchType.Film);
  const hasShow = array.includes(SearchType.Show);

  if (hasFilm && hasShow) {
    return SearchType.Multi;
  }
  if (hasFilm) {
    return SearchType.Film;
  }
  if (hasShow) {
    return SearchType.Show;
  }
  return undefined;
};

export enum TMDBSearchType {
  Movie = "movie",
  TV = "tv",
  Person = "person",
  Multi = "multi",
}

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

export type TMDBSortByType = "popularity" | "title" | "year" | "rating";
export type TMDBSortDirType = "desc" | "asc";
