import { SortBy } from '../../../shared/types/browse';
import { OverrideSortOptions } from '../components/Search/Results/PageResultsSort';

export const OVERRIDE_SORT_SEARCH: OverrideSortOptions = {
  overrideOptions: ['Relevance'],
  canInvert: false,
};

export const OVERRIDE_SORT_POPULARITY: OverrideSortOptions = {
  defaultOption: SortBy.Popularity,
  canInvert: true,
};
