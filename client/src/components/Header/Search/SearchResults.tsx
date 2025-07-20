import { JSX } from 'react';
import { IndexMediaData } from '../../../../../shared/types/models';
import useListNavigation from '../../../hooks/use-list-navigation';
import Separator from '../../common/Separator';
import SearchPoster from './components/SearchPoster';
import FirstSearchRow from './rows/FirstSearchRow';
import SearchRow from './rows/SearchRow';
import { routerPaths, urlFromIndexMedia } from '../../../utils/url-helper';
import LoadingSearchRow from './rows/LoadingSearchRow';

interface SearchResultsProps {
  searchValue: string;
  isLoading: boolean;
  searchResults: IndexMediaData[] | undefined;
  onClose: () => void;
  cleanField: VoidFunction;
}

const SearchResults = ({
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
      navigateTo(urlFromIndexMedia(searchResults[targetIndex - 1]));
    } else if (targetIndex === 0) {
      navigateTo(routerPaths.search.byTerm(searchValue));
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
      <div className="absolute left-full ml-2 min-h-50 h-full flex items-center ">
        <div className="flex-shrink-0">
          <SearchPoster media={mediaToShow} />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
