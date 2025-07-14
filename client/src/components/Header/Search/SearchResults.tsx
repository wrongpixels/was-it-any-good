import { JSX, useState } from 'react';
import { IndexMediaData } from '../../../../../shared/types/models';
import useListNavigation from '../../../hooks/use-list-navigation';
import Separator from '../../common/Separator';
import SearchPoster from './components/SearchPoster';
import FirstSearchRow from './rows/FirstSearchRow';
import SearchRow from './rows/SearchRow';
import { useNavigate } from 'react-router-dom';
import { urlFromIndexMedia } from '../../../utils/url-helper';

interface SearchResultsProps {
  searchValue: string;
  searchResults: IndexMediaData[] | undefined;
  onClose: () => void;
  cleanField: VoidFunction;
}

const SearchResults = ({
  searchValue,
  onClose,
  cleanField,
  searchResults = [],
}: SearchResultsProps): JSX.Element | null => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const totalItems = searchResults.length === 0 ? 1 : searchResults.length + 1;
  const { activeIndex, ref } = useListNavigation({
    maxIndex: totalItems,
    onEsc: onClose,
    onClick: () => navigateToHover(),
    onClickOut: onClose,
    onEnter: () => navigateToActive(),
  });
  const navigateToHover = (): void => {
    handleNavigate(hoveredIndex);
  };
  const navigateToActive = (): void => {
    handleNavigate(activeIndex);
  };
  const handleNavigate = (targetIndex: number | null): void => {
    if (targetIndex && targetIndex > 0) {
      navigate(urlFromIndexMedia(searchResults[targetIndex - 1]));
      cleanField();
    }
    onClose();
  };

  let posterToShow: IndexMediaData | null = null;
  if (hoveredIndex !== null && hoveredIndex > 0) {
    posterToShow = searchResults[hoveredIndex - 1];
  } else if (activeIndex > 0 && activeIndex <= searchResults.length) {
    posterToShow = searchResults[activeIndex - 1];
  }
  return (
    <div className="flex flex-row gap-2 relative" ref={ref}>
      <div className="bg-white border-3 flex flex-col border-white rounded-lg ring-1 ring-gray-300 shadow-lg cursor-pointer text-[15px] text-gray-500">
        <FirstSearchRow
          searchValue={searchValue}
          isSelected={activeIndex === 0}
          onHover={(isHovering) => setHoveredIndex(isHovering ? 0 : null)}
        />
        {searchResults?.length > 0 && (
          <div>
            <Separator margin={false} />
            {searchResults.map((mediaItem, index) => {
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
        )}
      </div>
      <div className="absolute left-full ml-2 min-h-50 h-full flex items-center ">
        <div className="flex-shrink-0">
          <SearchPoster imageSrc={posterToShow?.image ?? null} />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
