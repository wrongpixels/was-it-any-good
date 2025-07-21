import { JSX } from 'react';
import { IndexMediaData } from '../../../../shared/types/models';
import SearchCard from './SearchCard';

interface SearchPageResultsProps {
  results?: IndexMediaData[];
}

const SearchPageResults = ({
  results,
}: SearchPageResultsProps): JSX.Element | null => {
  if (!results) {
    return null;
  }
  return (
    <>
      <div className="flex flex-col items-center">
        {!!results && (
          <span className="text-xl font-medium">
            {results.length || 'No'} results!
          </span>
        )}
        <div className="pb-5" />
      </div>
      <div className="grid grid-cols-2 gap-4 items-center min-w-4xl">
        {results.map((i: IndexMediaData) => (
          <SearchCard key={i.id} media={i} />
        ))}
      </div>
    </>
  );
};

export default SearchPageResults;
