import { memo } from 'react';
import SearchCard from './SearchCard';
import { IndexMediaData } from '../../../../../shared/types/models';
import { BadgeType } from '../../../types/search-browse-types';
import { PLACEHOLDER_COUNT_SEARCH } from '../../../constants/placeholder-results-constants';
import PlaceholderPoster from '../../Posters/PlaceholderPoster';
import { SEARCH_CARD_H } from '../../../constants/results-constants';

interface SearchCardsProps {
  indexMedia: IndexMediaData[];
  indexOffset: number;
  badgeType: BadgeType;
}

const cardsClassName: string =
  'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3';

//we memo the SearchCards of the page for performance
const SearchCards = ({
  indexMedia,
  indexOffset,
  badgeType,
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
        />
      ))}
      <PlaceholderPoster
        placeholderCount={placeholderCount}
        className={`w-auto ${SEARCH_CARD_H}`}
      />
    </div>
  );
};

export default memo(SearchCards);
