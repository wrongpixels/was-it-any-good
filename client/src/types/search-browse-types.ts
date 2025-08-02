import { JSX } from 'react';
import { OrderBy, Sorting } from '../../../shared/types/browse';
import { SearchType } from '../../../shared/types/search';

//The parameters that can be overriden in the browse/search pages
//so they can be used instead of the url equivalents
export interface OverrideParams {
  basePath?: string;
  orderBy?: OrderBy;
  sort?: Sorting;
  searchType?: SearchType;
}

export interface BrowsePageTitleOptions {
  title: string;
  icon?: JSX.Element;
  tabTitle?: string;
}

export interface QueryOpts {
  newTerm?: string;
  newPage?: number;
}
