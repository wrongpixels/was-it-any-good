import { JSX } from 'react';
import {
  IndexMediaData,
  IndexMediaResponse,
} from '../../../../shared/types/models';
import SearchCard from './SearchCard';
import Button from '../common/Button';
import DisabledDiv from '../common/DisabledDiv';
import { styles } from '../../constants/tailwind-styles';
import { PAGE_LENGTH } from '../../../../shared/types/search-browse';

interface PageResultsProps {
  results: IndexMediaResponse | undefined;
  navigatePages: (movement: number) => void;
  term?: string;
  title?: string;
  showBadge?: boolean;
}

const PageResults = ({
  results,
  term,
  navigatePages,
  showBadge,
}: PageResultsProps): JSX.Element | null => {
  if (!results) {
    return null;
  }

  const searchTerm = (): JSX.Element => (
    <>
      {' for '}
      <span className="italic text-gray-500 font-normal pl-1">"{term}"</span>
    </>
  );

  const indexOffset: number = (results.page - 1) * PAGE_LENGTH + 1;

  return (
    <div className="flex flex-col font-medium gap-5">
      <div className="relative w-full h-8 flex items-center">
        <span className="w-full text-center text-lg">
          {results.totalResults || 'No'} results <>{term && searchTerm()}</>
        </span>

        <span className="absolute right-0 top-0 flex flex-row items-center gap-2 h-full">
          {`Page ${results.page} of ${results.totalPages}`}
          <span className="flex flex-row gap-1">
            <DisabledDiv disabled={results.page === 1}>
              <Button
                className={`w-8 ${styles.animations.buttonLeft}`}
                onClick={() => navigatePages(-1)}
              >
                ⏴
              </Button>
            </DisabledDiv>
            <DisabledDiv disabled={results.page >= results.totalPages}>
              <Button
                className={`w-8 ${styles.animations.buttonRight}`}
                onClick={() => navigatePages(1)}
              >
                ⏵
              </Button>
            </DisabledDiv>
          </span>
        </span>
      </div>

      {results.indexMedia.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {results.indexMedia.map((im: IndexMediaData, index: number) => (
            <SearchCard
              key={im.id}
              media={im}
              index={index + indexOffset}
              showBadge={showBadge}
            />
          ))}
        </div>
      ) : (
        <div className="h-64 w-full" aria-hidden="true" />
      )}
    </div>
  );
};

export default PageResults;
