import { JSX } from 'react';
import {
  IndexMediaResults,
  RatingResults,
  UserListValues,
  UserMediaListItemData,
} from '../../../../../shared/types/models';

import {
  OverrideParams,
  PAGE_LENGTH_BROWSE,
  URLParameters,
} from '../../../../../shared/types/search-browse';
import PageResultsNav from './PageResultsNav';
import Instructions from '../../Common/Instructions';
import { BadgeType } from '../../../types/search-browse-types';
import { NavigateToQueryOptions } from '../../../hooks/use-url-query-manager';
import SpinnerPage from '../../Common/Status/SpinnerPage';
import PageResultsSort, { OverrideSortOptions } from './PageResultsSort';
import PageResultsTitle from './PageResultsTitle';
import SearchCards from '../Cards/SearchCards';
import RatingCards from '../Cards/RatingCards';
import { SortBy } from '../../../../../shared/types/browse';
import {
  QueryClient,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useWatchlistMutation,
  WatchlistMutationOptions,
} from '../../../mutations/watchlist-mutations';

interface PageResultsProps {
  results: IndexMediaResults | RatingResults | undefined;
  navigatePages: (movement: number) => void;
  navigateToQuery: (options: NavigateToQueryOptions) => void;
  urlParams: URLParameters;
  queryKey?: string[];
  term?: string;
  title?: string;
  badgeType: BadgeType;
  showNavBar?: boolean;
  overrideParams?: OverrideParams;
  overrideSortOptions?: OverrideSortOptions;
  isLoading?: boolean;
}

//extended version with the list mutation incorporated
export interface UserListMutationValues extends UserListValues {
  listMutation:
    | UseMutationResult<
        UserMediaListItemData,
        Error,
        WatchlistMutationOptions,
        unknown
      >
    | undefined;
  resetListQuery: () => void;
}

//we render here the results, shared between Search and Browse
const PageResults = ({
  results,
  queryKey,
  urlParams,
  term,
  navigateToQuery,
  navigatePages,
  isLoading,
  badgeType = BadgeType.None,
  showNavBar = true,
  overrideSortOptions,
  overrideParams,
}: PageResultsProps): JSX.Element | null => {
  if (!results) {
    return null;
  }
  //we mount the object with the logic to modify the list on each card, but only if results
  //has a valid userListValues assigned
  const queryClient: QueryClient = useQueryClient();
  const resetListQuery: () => void = () => {
    console.log('Resetting:', queryKey);
    queryClient.refetchQueries({
      queryKey,
    });
  };
  const listMutation =
    queryKey && results.userListValues ? useWatchlistMutation() : undefined;
  const userListValues: UserListMutationValues | undefined =
    results.userListValues
      ? {
          ...results.userListValues,
          resetListQuery,
          listMutation,
        }
      : undefined;

  const submitFilter = (overrideParams: OverrideParams) => {
    navigateToQuery({ replace: true, overrideParams });
  };

  const indexOffset: number = (results.page - 1) * PAGE_LENGTH_BROWSE + 1;
  const resultsPageLength: number =
    results.resultsType === 'browse'
      ? results.indexMedia.length
      : results.ratings.length;

  return (
    <div className="flex flex-col font-medium gap-5 flex-1">
      {showNavBar && (
        <>
          <div className="relative w-full h-8 flex flex-row">
            <PageResultsTitle
              totalResults={results.totalResults}
              queryType={urlParams.queryType}
              term={term}
              resultsType={results.resultsType}
            />
            <PageResultsNav results={results} navigatePages={navigatePages} />
          </div>
          <PageResultsSort
            overrideParams={overrideParams}
            overrideSortOptions={overrideSortOptions}
            urlParams={urlParams}
            submitFilter={submitFilter}
          />
        </>
      )}
      {(isLoading && (
        <span className="flex-1">
          <SpinnerPage
            text={`
            Browsing WIAG...`}
            className="flex-1"
          />
        </span>
      )) || (
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {results.resultsType === 'browse' &&
            results.indexMedia.length > 0 ? (
              <SearchCards
                indexMedia={results.indexMedia}
                userListValues={userListValues}
                indexOffset={indexOffset}
                badgeType={badgeType}
              />
            ) : results.resultsType === 'votes' &&
              results.ratings.length > 0 ? (
              <RatingCards
                ratings={results.ratings}
                showDate={
                  urlParams.sortBy == SortBy.VoteDate ||
                  overrideParams?.sortBy == SortBy.VoteDate
                }
              />
            ) : (
              <Instructions
                linkToSearch={true}
                resultsType={results.resultsType}
              />
            )}
          </div>
        </div>
      )}

      {showNavBar && resultsPageLength > 9 && (
        <span className="relative w-full mt-5 mb-2 h-fit">
          <PageResultsNav results={results} navigatePages={navigatePages} />
        </span>
      )}
    </div>
  );
};

export default PageResults;
