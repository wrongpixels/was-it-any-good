import { JSX } from 'react';
import { IndexMediaData } from '../../../../shared/types/models';
import SearchCard from './SearchCard';
import Button from '../common/Button';
import DisabledDiv from '../common/DisabledDiv';
import { styles } from '../../constants/tailwind-styles';

interface SearchPageResultsProps {
  totalPages: number;
  totalResults: number;
  page: number;
  results: IndexMediaData[][];
  navigatePage: (movement: number) => void;
  term?: string;
}

const PageResults = ({
  results,
  totalResults,
  totalPages,
  page = 1,
  term,
  navigatePage,
}: SearchPageResultsProps): JSX.Element | null => {
  if (!results) {
    return null;
  }
  return (
    <>
      <div className="flex flex-col items-center mx-auto relative font-medium gap-5">
        {!!results && term && (
          <span className="text-lg flex flex-row justify-center">
            {totalResults || 'No'} results for "
            {<span className="italic text-gray-500 font-normal">{term}</span>}"
          </span>
        )}
        <span className="absolute right-0 flex flex-row items-center gap-2">
          {`Page ${page} of ${totalPages}`}
          <span className="flex flex-row gap-1">
            <DisabledDiv disabled={page === 1}>
              <Button
                className={`w-8 ${styles.animations.buttonLeft}`}
                onClick={() => navigatePage(-1)}
              >
                ⏴
              </Button>
            </DisabledDiv>
            <DisabledDiv disabled={page >= totalPages}>
              <Button
                className={`w-8 ${styles.animations.buttonRight}`}
                onClick={() => navigatePage(1)}
              >
                ⏵
              </Button>
            </DisabledDiv>
          </span>
        </span>
        {results.map((r: IndexMediaData[], i: number) => (
          <div
            className="grid grid-cols-3 gap-4 items-center min-w-4xl max-w-1"
            key={`indexR-${i}`}
          >
            {r.map((i: IndexMediaData) => (
              <SearchCard key={i.id} media={i} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default PageResults;
