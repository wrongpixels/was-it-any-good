export enum SortBy {
  Title = "name",
  Rating = "rating",
  Popularity = "popularity",
  Year = "year",
}
export const sortByValues: string[] = Object.values<string>(SortBy);

export enum SortDir {
  Descending = "DESC",
  Ascending = "ASC",
}
export const sortDirValues: string[] = Object.values<string>(SortDir);

export enum SortDirDropdown {
  DESC = "Descending",
  ASC = "Ascending",
}
export const sortDirDropdown: string[] = Object.values(SortDirDropdown);

export const isSortBy = (value: string): value is SortBy =>
  sortByValues.includes(value);

export const stringToSortBy = (
  value: string | undefined | null
): SortBy | undefined => {
  if (!value || !isSortBy(value)) {
    return SortBy.Popularity;
  }
  return value;
};

export const isSortDir = (value: string): value is SortDir =>
  sortDirValues.includes(value);

export const sortDirDropdownToSortDir = (value: string) => {
  switch (value) {
    case SortDirDropdown.ASC:
      return SortDir.Ascending;
    case SortDirDropdown.DESC:
    default:
      return SortDir.Descending;
  }
};

export const stringToSortDir = (
  value: string | undefined | null
): SortDir | undefined => {
  if (!value || !isSortDir(value)) {
    return SortDir.Descending;
  }
  return value;
};
