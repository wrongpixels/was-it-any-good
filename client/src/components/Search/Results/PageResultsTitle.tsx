import { JSX } from 'react';
import { SearchType } from '../../../../../shared/types/search';
import { queryTypeToDisplayName } from '../../../utils/url-helper';
import { BrowseResultsType } from '../../../../../shared/types/models';

interface PageResultsTitleProps {
  term: string | undefined;
  totalResults: number;
  queryType: SearchType[];
  resultsType: BrowseResultsType;
}

const PageResultsTitle = ({
  term,
  totalResults,
  queryType,
  resultsType,
}: PageResultsTitleProps): JSX.Element => {
  const resultString: string = resultsType === 'votes' ? 'vote' : 'result';
  return (
    <span className="w-full text-center text-lg sm:block hidden">
      {totalResults || 'No'}
      {` ${queryTypeToDisplayName(queryType)} `}
      {` ${totalResults !== 1 ? `${resultString}s` : `${resultString}`} `}
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
