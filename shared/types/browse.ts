export enum OrderBy {
  Title = "name",
  Rating = "rating",
  Popularity = "popularity",
  Year = "year",
}
export const orderByValues: string[] = Object.values<string>(OrderBy);

export enum Sorting {
  descending = "DESC",
  ascending = "ASC",
}
const sortValues: string[] = Object.values<string>(Sorting);

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
