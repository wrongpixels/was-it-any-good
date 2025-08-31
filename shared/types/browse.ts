export enum SortBy {
  Title = "name",
  Rating = "rating",
  Popularity = "popularity",
  Year = "year",
}
export const sortByValues: string[] = Object.values<string>(SortBy);

export enum SortDir {
  descending = "DESC",
  ascending = "ASC",
}
export const sortDirValues: string[] = Object.values<string>(SortDir);

export enum SortDirDropdown {
  DESC = "Descending",
  ASC = "Ascending",
}
export const sortDirDropdown: string[] = Object.values<string>(SortDirDropdown);

export const isSortBy = (value: string): value is SortBy =>
  sortByValues.includes(value);

export const stringToSortBy = (
  value: string | undefined | null
): SortBy | undefined => {
  if (!value || !isSortBy(value)) {
    return undefined;
  }
  return value;
};

export const isSortDir = (value: string): value is SortDir =>
  sortDirValues.includes(value);

export const stringToSortDir = (
  value: string | undefined | null
): SortDir | undefined => {
  if (!value || !isSortDir(value)) {
    return undefined;
  }
  return value;
};
