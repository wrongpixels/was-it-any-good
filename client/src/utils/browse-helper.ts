import { SortBy } from '../../../shared/types/browse';
import { SearchType } from '../../../shared/types/search';

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
