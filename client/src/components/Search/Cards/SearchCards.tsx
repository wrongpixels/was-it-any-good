import { memo } from 'react';
import SearchCard from './SearchCard';
import { IndexMediaData } from '../../../../../shared/types/models';
import { BadgeType } from '../../../types/search-browse-types';
import { PLACEHOLDER_COUNT_SEARCH } from '../../../constants/placeholder-results-constants';
import PlaceholderPoster from '../../Posters/PlaceholderPoster';
import { BrowseCacheOps } from '../../../hooks/use-results-list-values';

interface SearchCardsProps {
  indexMedia: IndexMediaData[];
  indexOffset: number;
  badgeType: BadgeType;
  browseCacheOps?: BrowseCacheOps;
}

const cardsClassName =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 place-items-center w-full';

//we memo the SearchCards of the page for performance
const SearchCards = ({
  indexMedia,
  indexOffset,
  badgeType,
  browseCacheOps,
}: SearchCardsProps) => {
  const placeholderCount: number = PLACEHOLDER_COUNT_SEARCH - indexMedia.length;
  return (
    <div className={cardsClassName}>
      {indexMedia.map((im: IndexMediaData, index: number) => (
        <SearchCard
          key={im.id}
          media={im}
          index={index + indexOffset}
          badgeType={badgeType}
          browseCacheOps={browseCacheOps}
        />
      ))}
      <PlaceholderPoster
        placeholderCount={placeholderCount}
        className={'w-full max-w-90 h-full hidden sm:block'}
      />
    </div>
  );
};

export default memo(SearchCards);
