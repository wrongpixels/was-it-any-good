import { JSX, useState } from 'react';
import { IndexMediaData } from '../../../../../shared/types/models';
import useListNavigation from '../../../hooks/use-list-navigation';
import Separator from '../../common/Separator';
import SearchPoster from './components/SearchPoster';
import FirstSearchRow from './rows/FirstSearchRow';
import SearchRow from './rows/SearchRow';

interface SearchResultsProps {
  searchValue: string;
  onClose: () => void;
}

const SearchResults = ({
  searchValue,
  onClose,
}: SearchResultsProps): JSX.Element | null => {
  const testSearch: IndexMediaData[] = [];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const totalItems = testSearch.length + 1;
  const { activeIndex, ref } = useListNavigation({
    maxIndex: totalItems,
    onEsc: onClose,
  });

  let posterToShow: IndexMediaData | null = null;
  if (activeIndex > 0 && activeIndex <= testSearch.length) {
    posterToShow = testSearch[activeIndex - 1];
  } else if (hoveredIndex !== null && hoveredIndex > 0) {
    posterToShow = testSearch[hoveredIndex - 1];
  }

  return (
    <div className="flex flex-row gap-2 items-center" ref={ref}>
      <div className="bg-white border-3 flex flex-col border-white rounded-lg ring-1 ring-gray-300 shadow-lg cursor-pointer text-[15px] text-gray-500">
        <FirstSearchRow
          searchValue={searchValue}
          isSelected={activeIndex === 0}
          onHover={(isHovering) => setHoveredIndex(isHovering ? 0 : null)}
        />
        <Separator margin={false} />
        {testSearch.map((mediaItem, index) => {
          const itemIndex = index + 1;
          return (
            <SearchRow
              key={mediaItem.id}
              indexMedia={mediaItem}
              isSelected={itemIndex === activeIndex}
              onHover={(isHovering) => {
                setHoveredIndex((prev) =>
                  isHovering ? itemIndex : prev === itemIndex ? null : prev
                );
              }}
            />
          );
        })}
      </div>
      <span>
        <SearchPoster imageSrc={posterToShow?.image ?? null} />
      </span>
    </div>
  );
};

export default SearchResults;
