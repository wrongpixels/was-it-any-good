export enum SortBy {
  Date = "updatedAt",
  Title = "name",
  Rating = "rating",
  UserRating = "userRating",
  Popularity = "popularity",
  Year = "year",
}
//by default, we exclude the Date option, it should only be available
//on User Votes and other special cases
export const sortByValues: string[] = Object.values<string>(SortBy).filter(
  (s: string) => s !== SortBy.Date && s !== SortBy.UserRating
);
export const sortByUserValues: string[] = Object.values<string>(SortBy);

export enum SortDir {
  Default = "DESC",
  Inverted = "ASC",
}
export const sortDirValues: string[] = Object.values<string>(SortDir);

export const invertSortDir = (value: string | undefined): SortDir =>
  value === SortDir.Inverted ? SortDir.Default : SortDir.Inverted;

export enum SortDirDropdown {
  DESC = "Default",
  ASC = "Inverted",
}
export const sortDirDropdown: string[] = Object.values(SortDirDropdown);

export const isSortBy = (value: string): value is SortBy =>
  sortByValues.includes(value);

export const stringToSortBy = (
  value: string | undefined | null
): SortBy | undefined => {
  if (!value || !isSortBy(value)) {
    return SortBy.Rating;
  }
  return value;
};

export const isSortDir = (value: string): value is SortDir =>
  sortDirValues.includes(value);

export const sortDirDropdownToSortDir = (value: string) => {
  switch (value) {
    case SortDirDropdown.ASC:
      return SortDir.Inverted;
    case SortDirDropdown.DESC:
    default:
      return SortDir.Default;
  }
};

export const sortDirToSortDirDropdown = (value: SortDir | undefined) => {
  switch (value) {
    case SortDir.Inverted:
      return SortDirDropdown.ASC;
    case SortDir.Default:
    default:
      return SortDirDropdown.DESC;
  }
};

export const stringToSortDir = (
  value: string | undefined | null
): SortDir | undefined => {
  if (!value || !isSortDir(value)) {
    return SortDir.Default;
  }
  return value;
};
