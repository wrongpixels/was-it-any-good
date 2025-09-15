import { DropdownOption, getDropdownValue } from "./common";

//our SortBy options. The string of the enum parallels the field of the
//table, so it can be applied directly on sequelize options
export enum SortBy {
  VoteDate = "updatedAt",
  Title = "name",
  Rating = "rating",
  UserScore = "userScore",
  Popularity = "popularity",
  Year = "year",
}
//The Dropdown Values for our SortBy, to assign them better Display names.
//by default, we exclude the VoteDate option, it should only be available
//on User Votes and other special cases
export const sortByValues: DropdownOption[] = [
  [SortBy.Title, "Title"],
  [SortBy.Rating, "Rating"],
  [SortBy.Popularity, "Popularity"],
  [SortBy.Year, "Year"],
];

export const sortByUserValues: DropdownOption[] = [
  [SortBy.VoteDate, "Date"],
  [SortBy.UserScore, "Rating"],
  ...sortByValues.filter(
    (d: DropdownOption) => getDropdownValue(d) !== SortBy.Rating
  ),
];

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
  Object.values<string>(SortBy).includes(value);

export const stringToSortBy = (
  value: string | undefined | null
): SortBy | null => {
  if (!value || !isSortBy(value)) {
    return null;
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
