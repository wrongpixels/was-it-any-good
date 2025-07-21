import { JSX } from 'react';
import { IndexMediaData } from '../../../../shared/types/models';
import SearchPoster from '../Header/Search/components/SearchPoster';
import Separator from '../common/Separator';

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
    <div className="flex flex-col items-center">
      {!!results && (
        <span className="text-xl font-medium">
          {results.length || 'No'} results!
        </span>
      )}
      <div className="pb-5" />

      <div className="flex flex-wrap gap-4 auto-rows-auto items-center justify-center">
        {results.map((i: IndexMediaData) => (
          <SearchPoster key={i.id} media={i} />
        ))}
      </div>
    </div>
  );
};

export default SearchPageResults;
