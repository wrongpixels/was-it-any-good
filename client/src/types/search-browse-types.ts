import { JSX } from 'react';
import { SortBy, SortDir } from '../../../shared/types/browse';
import { SearchType } from '../../../shared/types/search';
import { CountryCode } from '../../../shared/types/countries';

//The parameters that can be overriden in the browse/search pages
//so they can be used instead of the url equivalents
export interface OverrideParams {
  basePath?: string;
  sortBy?: SortBy;
  sortDir?: SortDir;
  searchType?: SearchType;
}
export interface URLParameters {
  searchTerm: string | null;
  currentPage: number;
  queryType: string[];
  genres: string[];
  countries: CountryCode[];
  year: string | null;
  sortBy: SortBy | undefined;
  sortDir: SortDir | undefined;
}
export interface BrowsePageTitleOptions {
  title: string;
  subtitle?: string;
  icon?: JSX.Element;
  tabTitle?: string;
}

export interface QueryOpts {
  newTerm?: string;
  newPage?: number;
}

export enum BadgeType {
  RankBadge,
  AddedBadge,
  None,
}
