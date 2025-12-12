import { JSX, memo } from 'react';
import { IndexMediaData } from '../../../../../shared/types/models';
import useListNavigation from '../../../hooks/use-list-navigation';
import SuggestionPoster from '../../Posters/SuggestionPoster';
import FirstSearchRow from './Rows/FirstSearchRow';
import SearchRow from './Rows/SearchRow';
import LoadingSearchRow from './Rows/LoadingSearchRow';
import Separator from '../../Common/Separator';
import { buildIndexMediaLinkWithSlug } from '../../../../../shared/util/url-builder';

interface SearchResultsProps {
  handleSearch: (value: string | null) => void;
  searchValue: string;
  isLoading: boolean;
  searchResults: IndexMediaData[] | undefined;
  onClose: () => void;
  cleanField: VoidFunction;
}

const SearchResults = ({
  handleSearch,
  searchValue,
  isLoading,
  onClose,
  cleanField,
  searchResults = [],
}: SearchResultsProps): JSX.Element | null => {
  const totalItems = searchResults.length === 0 ? 1 : searchResults.length + 1;
  const { activeIndex, hoveredIndex, setHoveredIndex, navigateTo, ref } =
    useListNavigation({
      maxIndex: totalItems,
      onEsc: onClose,
      onClick: () => navigateToHoverResult(),
      onEnter: () => navigateToActiveResult(),
      onClickOut: onClose,
      onNavigate: cleanField,
    });

  const navigateToHoverResult = (): void => {
    navigateToResult(hoveredIndex);
  };
  const navigateToActiveResult = (): void => {
    navigateToResult(activeIndex);
  };
  const navigateToResult = (targetIndex: number | null): void => {
    if (targetIndex && targetIndex > 0) {
      navigateTo(buildIndexMediaLinkWithSlug(searchResults[targetIndex - 1]));
    }
    //if we're on row 0, we search
    else if (targetIndex === 0) {
      cleanField();
      handleSearch(searchValue);
    }
  };
  let mediaToShow: IndexMediaData | null = null;
  if (hoveredIndex !== null && hoveredIndex > 0) {
    mediaToShow = searchResults[hoveredIndex - 1];
  } else if (activeIndex > 0 && activeIndex <= searchResults.length) {
    mediaToShow = searchResults[activeIndex - 1];
  }
  return (
    <div className="flex flex-row gap-2 relative" ref={ref}>
      <div className="bg-white border-3 flex flex-col border-white rounded-lg ring-1 ring-gray-300 shadow-lg cursor-pointer text-[15px] text-gray-500 w-max">
        <FirstSearchRow
          searchValue={searchValue}
          isSelected={activeIndex === 0}
          onHover={(isHovering) => setHoveredIndex(isHovering ? 0 : null)}
        />
        <LoadingSearchRow condition={isLoading} />
        {!isLoading && searchResults?.length > 0 && (
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
      {mediaToShow && (
        <div className="absolute left-full ml-2 min-h-60 h-full items-center hidden sm:flex">
          <div className="flex-shrink-0">
            <SuggestionPoster media={mediaToShow} />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SearchResults);
