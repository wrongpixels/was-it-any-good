import { SortBy, SortDir } from "./browse";
import { CountryCode } from "./countries";
import { SearchType } from "./search";

export const PAGE_LENGTH: number = 21;

//The parameters that can be overridden in the browse/search pages
//so they can be used instead of the url equivalents
export interface OverrideParams {
  basePath?: string;
  sortBy?: SortBy;
  sortDir?: SortDir;
  searchType?: SearchType;
}
export interface URLParameters {
  searchTerm: string | null;
  searchPage: number;
  queryType: SearchType[];
  genres: string[];
  countries: CountryCode[];
  year: string | null;
  sortBy: SortBy | null;
  sortDir: SortDir;
}
