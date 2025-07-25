import { JSX } from 'react';
import {
  IndexMediaData,
  IndexMediaResponse,
} from '../../../../shared/types/models';
import SearchCard from './SearchCard';

interface SearchPageResultsProps {
  results?: IndexMediaResponse;
  term: string;
}

const SearchPageResults = ({
  results,
  term,
}: SearchPageResultsProps): JSX.Element | null => {
  if (!results) {
    return null;
  }
  return (
    <>
      <div className="flex flex-col items-center">
        {!!results && (
          <span className="text-xl font-medium">
            {results.totalResults || 'No'} results for "
            {<span className="italic text-gray-500 font-normal">{term}</span>}"!
          </span>
        )}
        <div className="pb-7" />
      </div>
      <div className="grid grid-cols-3 gap-4 items-center min-w-4xl max-w-1">
        {results.indexMedia.map((i: IndexMediaData) => (
          <SearchCard key={i.id} media={i} />
        ))}
      </div>
    </>
  );
};

export default SearchPageResults;
