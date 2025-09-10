//the query parameter names to expect on the url

import { SortBy, SortDir } from "../types/browse";
import { SearchType } from "../types/search";

export const UPARAM_SEARCH_TERM: string = "q";
export const UPARAM_PAGE: string = "page";
export const UPARAM_QUERY_TYPE: string = "m";
export const UPARAM_GENRES: string = "g";
export const UPARAM_COUNTRIES: string = "c";
export const UPARAM_YEAR: string = "y";
export const UPARAM_SORT_BY: string = "sort";
export const UPARAM_SORT_DIR: string = "dir";

export const DEF_SORT_BY: SortBy = SortBy.Rating;
export const DEF_SORT_DIR: SortDir = SortDir.Default;
export const DEF_SEARCH_TYPE: SearchType = SearchType.Multi;
export const DEF_PAGE: string = "1";
