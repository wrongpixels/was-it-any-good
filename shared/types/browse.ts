export enum OrderBy {
  Title = 'title',
  Rating = 'rating',
  Popularity = 'popularity',
}
const orderByValues: string[] = Object.values<string>(OrderBy);

export const isOrderBy = (value: string): value is OrderBy =>
  orderByValues.includes(value);

export const stringToOrderBy = (value: string): OrderBy | null => {
  if (!value || !isOrderBy(value)) {
    return null;
  }
  return value;
};

export enum Sorting {
  descending = 'DESC',
  ascending = 'ASC',
}

const sortValues: string[] = Object.values<string>(Sorting);
export const isSorting = (value: string) => sortValues.includes(value);
export const stringToSorting = (value: string) => {
  if (!value || !isSorting(value)) {
    return null;
  }
  return value;
};
