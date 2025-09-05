import { memo } from 'react';
import SearchCard from './SearchCard';
import { IndexMediaData } from '../../../../../shared/types/models';
import { BadgeType } from '../../../types/search-browse-types';
import { PLACEHOLDER_COUNT_SEARCH } from '../../../constants/placeholder-results-constants';
import PlaceholderPoster from '../../Posters/PlaceholderPoster';
import {
  RESULTS_ROW_SEARCH,
  SEARCH_CARD_H,
} from '../../../constants/results-constants';

interface SearchCardsProps {
  indexMedia: IndexMediaData[];
  indexOffset: number;
  badgeType: BadgeType;
}

const cardsClassName: string = `grid grid-cols-${RESULTS_ROW_SEARCH} gap-4 grid-template-columns: repeat(${RESULTS_ROW_SEARCH}, 1fr);`;

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
