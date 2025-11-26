import { JSX } from 'react';
import { SearchType } from '../../../../../shared/types/search';
import { queryTypeToDisplayName } from '../../../utils/url-helper';
import {
  BrowseResultsType,
  UserListValues,
} from '../../../../../shared/types/models';

interface PageResultsTitleProps {
  term: string | undefined;
  totalResults: number;
  queryType: SearchType[];
  resultsType: BrowseResultsType;
  userListValues?: UserListValues;
}

const PageResultsTitle = ({
  term,
  userListValues,
  totalResults,
  queryType,
  resultsType,
}: PageResultsTitleProps): JSX.Element => {
  const typeString: string = queryTypeToDisplayName(queryType) || 'result';
  const finalTypeString: string =
    term && !typeString.includes('result')
      ? `${typeString} result`
      : typeString;
  const resultString: string =
    resultsType === 'votes' ? 'rating' : finalTypeString;
  const displayString: string =
    userListValues && !totalResults
      ? `Hey, your Watchlist is empty!`
      : `${totalResults || 'No'} ${totalResults !== 1 ? `${resultString}s` : `${resultString}`}`;
  return (
    <span className="w-full text-center text-lg sm:block hidden line whitespace-pre-line">
      {displayString}
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
