import { SortBy } from '../../../shared/types/browse';
import { SearchType } from '../../../shared/types/search';
import { OverrideParams } from '../../../shared/types/search-browse';
import { OverrideSortOptions } from '../components/Search/Results/PageResultsSort';
import { OVERRIDE_SORT_POPULARITY } from '../constants/search-browse-constants';

//a function to transform OverrideParams into specific OverrideSortOptions
//For example: Override Popularity -> We can only sort by it
export const overrideParamsToOverrideSort = (
  overrideParams: OverrideParams | undefined
): OverrideSortOptions | undefined => {
  if (!!!overrideParams) {
    return undefined;
  }
  if (overrideParams.sortBy === SortBy.Popularity) {
    return OVERRIDE_SORT_POPULARITY;
  }
};

export const getBrowseTitle = (
  searchType?: SearchType,
  order?: SortBy
): string => {
  if (!order || !searchType) {
    return 'Browsing Media';
  }

  const relationship: string =
    order === SortBy.Popularity
      ? 'Most Popular'
      : order === SortBy.Rating
        ? 'Top Rated'
        : order === SortBy.Year
          ? 'by Year'
          : 'by Title';

  const media: string =
    searchType === SearchType.Film
      ? 'Films'
      : searchType === SearchType.Show
        ? 'Shows'
        : searchType === SearchType.Multi
          ? 'Media'
          : 'People';

  return order === SortBy.Title || order === SortBy.Year
    ? `${media} &${relationship}`
    : `${relationship} ${media}`;
};
