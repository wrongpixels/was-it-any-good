import { MediaType } from './media';

export enum OrderBy {
  Title = 'name',
  Rating = 'rating',
  Popularity = 'popularity',
}
const orderByValues: string[] = Object.values<string>(OrderBy);

export enum Sorting {
  descending = 'DESC',
  ascending = 'ASC',
}
const sortValues: string[] = Object.values<string>(Sorting);

export enum BrowseType {
  Film = MediaType.Film,
  Show = MediaType.Show,
  Multi = 'Multi',
}

export const isOrderBy = (value: string): value is OrderBy =>
  orderByValues.includes(value);

export const stringToOrderBy = (
  value: string | undefined | null
): OrderBy | undefined => {
  if (!value || !isOrderBy(value)) {
    return undefined;
  }
  return value;
};

export const isSorting = (value: string): value is Sorting =>
  sortValues.includes(value);

export const stringToSorting = (
  value: string | undefined | null
): Sorting | undefined => {
  if (!value || !isSorting(value)) {
    return undefined;
  }
  return value;
};

export const arrayToBrowseType = (array: string[]): BrowseType | undefined => {
  const hasFilm = array.includes(BrowseType.Film);
  const hasShow = array.includes(BrowseType.Show);

  if (hasFilm && hasShow) {
    return BrowseType.Multi;
  }
  if (hasFilm) {
    return BrowseType.Film;
  }
  if (hasShow) {
    return BrowseType.Show;
  }
  return undefined;
};
