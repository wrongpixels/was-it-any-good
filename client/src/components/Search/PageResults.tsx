import { JSX } from 'react';
import { IndexMediaResponse } from '../../../../shared/types/models';

import { PAGE_LENGTH } from '../../../../shared/types/search-browse';
import Instructions from '../Common/Instructions';
import {
  BadgeType,
  OverrideParams,
  URLParameters,
} from '../../types/search-browse-types';
import { NavigateToQueryOptions } from '../../hooks/use-url-query-manager';
import SpinnerPage from '../Common/Status/SpinnerPage';

import SearchCards from './Cards/SearchCards';
import PageResultsNav from './Results/PageResultsNav';
import PageResultsSort from './Results/PageResultsSort';
import PageResultsTitle from './Results/PageResultsTitle';

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
  isLoading = true;
  const submitFilter = (overrideParams: OverrideParams) => {
    navigateToQuery({ replace: true, overrideParams });
  };

  const indexOffset: number = (results.page - 1) * PAGE_LENGTH + 1;

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
            <SearchCards
              indexMedia={results.indexMedia}
              indexOffset={indexOffset}
              badgeType={badgeType}
            />
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
