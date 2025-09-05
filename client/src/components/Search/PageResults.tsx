import { JSX, useMemo } from 'react';
import {
  IndexMediaData,
  IndexMediaResponse,
} from '../../../../shared/types/models';
import SearchCard from './SearchCard';

import { PAGE_LENGTH } from '../../../../shared/types/search-browse';
import PageResultsNav from './PageResultsNav';
import Instructions from '../common/Instructions';
import {
  BadgeType,
  OverrideParams,
  URLParameters,
} from '../../types/search-browse-types';
import { NavigateToQueryOptions } from '../../hooks/use-url-query-manager';
import SpinnerPage from '../common/status/SpinnerPage';
import PageResultsSort from './PageResultsSort';
import PageResultsTitle from './PageResultsTitle';

interface PageResultsProps {
  results: IndexMediaResponse | undefined;
  navigatePages: (movement: number) => void;
  navigateToQuery: (options: NavigateToQueryOptions) => void;
  urlParams: URLParameters;
  term?: string;
  title?: string;
  badgeType: BadgeType;
  showNavBar?: boolean;
  showSortOptions?: boolean;
  isLoading?: boolean;
}
//we render here the results, shared between Search and Browse
const PageResults = ({
  results,
  urlParams,
  term,
  navigateToQuery,
  navigatePages,
  isLoading,
  badgeType = BadgeType.None,
  showNavBar = true,
  showSortOptions = true,
}: PageResultsProps): JSX.Element | null => {
  if (!results) {
    return null;
  }
  const submitFilter = (overrideParams: OverrideParams) => {
    navigateToQuery({ replace: true, overrideParams });
  };

  const indexOffset: number = (results.page - 1) * PAGE_LENGTH + 1;

  //we memo the list of result Cards for performance
  const resultEntries: JSX.Element[] = useMemo(
    () =>
      results.indexMedia.map((im: IndexMediaData, index: number) => (
        <SearchCard
          key={im.id}
          media={im}
          index={index + indexOffset}
          badgeType={badgeType}
        />
      )),
    [results, badgeType]
  );
  return (
    <div className="flex flex-col font-medium gap-5 flex-1">
      {showNavBar && (
        <>
          <div className="relative w-full h-8 flex flex-row">
            <PageResultsTitle
              totalResults={results.totalResults}
              queryType={urlParams.queryType}
              term={term}
            />
            <PageResultsNav results={results} navigatePages={navigatePages} />
          </div>
          <PageResultsSort
            showSortOptions={showSortOptions}
            urlParams={urlParams}
            submitFilter={submitFilter}
          />
        </>
      )}
      {(isLoading && (
        <span className="flex-1">
          <SpinnerPage text={`Browsing WIAG...`} className="flex-1" />
        </span>
      )) || (
        <span className="flex-1">
          {results.indexMedia.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">{resultEntries}</div>
          ) : (
            <div className="h-64 w-full" aria-hidden="true">
              <Instructions condition={true} />
            </div>
          )}
        </span>
      )}

      {showNavBar && (
        <span className="relative w-full mt-5 mb-2 h-fit">
          <PageResultsNav results={results} navigatePages={navigatePages} />
        </span>
      )}
    </div>
  );
};

export default PageResults;
