import { JSX } from 'react';
import { SearchType } from '../../../../../shared/types/search';
import { queryTypeToDisplayName } from '../../../utils/url-helper';

interface PageResultsTitleProps {
  term: string | undefined;
  totalResults: number;
  queryType: SearchType[];
}

const PageResultsTitle = ({
  term,
  totalResults,
  queryType,
}: PageResultsTitleProps): JSX.Element => {
  return (
    <span className="w-full text-center text-lg">
      {totalResults || 'No'}
      {` ${queryTypeToDisplayName(queryType)} `}
      {' results '}
      <SearchTerm term={term} />
    </span>
  );
};

interface SearchTermProps {
  term: string | undefined;
}

const SearchTerm = ({ term }: SearchTermProps): JSX.Element | null => {
  if (!term) {
    return null;
  }
  return (
    <>
      {' for '}
      <span className="italic text-gray-500 font-normal">"{term}"</span>
    </>
  );
};

export default PageResultsTitle;
