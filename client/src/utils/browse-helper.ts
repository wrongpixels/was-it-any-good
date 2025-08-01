import { OrderBy } from '../../../shared/types/browse';
import { SearchType } from '../../../shared/types/search';

export const getBrowseTitle = (
  searchType?: SearchType,
  order?: OrderBy
): string => {
  if (!order || !searchType) {
    return 'Media Browser';
  }

  const relationship: string =
    order === OrderBy.Popularity
      ? 'Most popular'
      : order === OrderBy.Rating
        ? 'Top rated'
        : order === OrderBy.Year
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

  return order === OrderBy.Title || order === OrderBy.Year
    ? `${media} &${relationship}`
    : `${relationship} ${media}`;
};
