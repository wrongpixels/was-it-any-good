import { JSX, useEffect, useState } from 'react';
import PageResults from './Results/PageResults';
import SearchInputField from './SearchInput';
import {
  SearchDropDown,
  searchDropdownOptions,
  searchDropToType,
  SearchType,
} from '../../../../shared/types/search';
import { useNotificationContext } from '../../context/NotificationProvider';
import { useAnimEngine } from '../../context/AnimationProvider';
import useUrlQueryManager from '../../hooks/use-url-query-manager';
import ErrorPage from '../Common/Status/ErrorPage';
import { useTrendingQuery } from '../../queries/trending-queries';
import EntryTitle from '../EntryTitle';
import Instructions from '../Common/Instructions';
import { BadgeType } from '../../types/search-browse-types';
import useDropdown from '../../hooks/use-dropdown';
import Dropdown from '../Common/Custom/Dropdown';
import IconTrending from '../Common/Icons/Sorting/IconTrending';
import LoadingCards from './Loading/LoadingSearch';
import IconLoadingSpinner from '../Common/Icons/IconLoadingSpinner';
import { OVERRIDE_SORT_SEARCH } from '../../constants/search-browse-constants';
import { getDropdownValue } from '../../../../shared/types/common';
import Button from '../Common/Custom/Button';
import { IndexMediaResults } from '../../../../shared/types/models';
import IconAdd from '../Common/Icons/IconAdd';
import { setSEO } from '../../utils/set-seo';
import { clientPaths } from '../../../../shared/util/url-builder';
import { buildHomepageTrendingSeo } from '../../utils/page-seo-helpers';

//HomePage uses state to accumulate results, allowing users to load more instead of using pages.
//the search bar navigates the user to SearchPage to handle actual search queries.
const HomePage = (): JSX.Element | null => {
  const {
    urlParams,
    navigateToQuery: navigateToNewTerm,
    queryTypeManager,
    navigatePages,
  } = useUrlQueryManager({ basePath: clientPaths.search.base });

  const { setNotification, anchorRef } = useNotificationContext();
  const { playAnim } = useAnimEngine();

  const [searchResults, setSearchResults] = useState<
    IndexMediaResults | undefined
  >(undefined);
  //by default, we fetch page 1 of trending
  const [pageToFetch, setPageToFetch] = useState(1);

  const {
    data: fetchedSearchResults,
    isFetching,
    isLoading,
    isError,
  } = useTrendingQuery(pageToFetch);

  //to make the first fetch immediate and avoid the lag of useEffect
  if (!searchResults && fetchedSearchResults) {
    setSearchResults(fetchedSearchResults);
  }

  //an effect that assigns the just fetched results to the final display ones.
  useEffect(() => {
    if (fetchedSearchResults) {
      setSearchResults((prevResults) => {
        //for the very first fetch, it still not set, we just set the new results.
        if (!prevResults || fetchedSearchResults.page === 1) {
          return fetchedSearchResults;
        }
        //to avoid adding same page multiple times
        if (fetchedSearchResults.page <= (prevResults.page || 0)) {
          return prevResults;
        }
        //new results are fetched whenever the user presses "See More",
        //so we keep appending them to searchResults and updating its data
        return {
          ...fetchedSearchResults,
          indexMedia: [
            ...prevResults.indexMedia,
            ...fetchedSearchResults.indexMedia,
          ],
        };
      });
    }
    setSEO(buildHomepageTrendingSeo(fetchedSearchResults?.indexMedia));
  }, [fetchedSearchResults]);

  const toggleParam = (param: string) => {
    queryTypeManager.clearAll();
    queryTypeManager.toggleParamByName(searchDropToType(param));
  };

  const searchDropdown = useDropdown({
    defaultValue: SearchDropDown.All,
    name: 'searchType',
    onChanged: toggleParam,
  });

  const handleSearch = (newSearch: string | null) => {
    if (!newSearch) {
      setNotification({
        message: 'You are searching for\nliterally nothing!',
        anchorRef,
      });
      playAnim({
        animationClass: 'animate-shake',
        animKey: 'search-main-button',
      });
      return;
    }
    const searchType: SearchType = searchDropToType(
      getDropdownValue(searchDropdown.value)
    );

    console.log(searchType);
    //we navigate to SearchPage with the new term and selected type.
    navigateToNewTerm({
      newTerm: newSearch,
      overrideParams: {
        searchType,
      },
    });
  };

  const canLoadMore =
    searchResults && searchResults.page < searchResults.totalPages;

  const onSeeMore = () => {
    if (canLoadMore) {
      setPageToFetch((prevPage) => prevPage + 1);
    }
  };

  if (isError) {
    return <ErrorPage />;
  }

  const showInitialLoading = isLoading && !searchResults;

  return (
    <div className="flex flex-col items-center gap-4 pt-4 flex-1">
      <span className="flex flex-row gap-2">
        <Dropdown
          {...searchDropdown.getProps()}
          options={searchDropdownOptions}
        />
        <SearchInputField text={undefined} handleSearch={handleSearch} />
      </span>

      <Instructions />
      <span className="w-full -mt-4">
        <EntryTitle
          title={'Trending Today'}
          icon={
            isFetching ? (
              <IconLoadingSpinner className="mx-1 h-4.5" />
            ) : (
              <IconTrending className={'text-gold'} height={24} />
            )
          }
        />
      </span>

      {showInitialLoading ? (
        <LoadingCards showNavBar={false} />
      ) : (
        <span className="pt-1 w-full flex flex-1">
          {searchResults && (
            <div className="flex flex-1">
              <PageResults
                urlParams={urlParams}
                results={searchResults}
                term={undefined}
                navigateToQuery={navigateToNewTerm}
                navigatePages={navigatePages}
                showNavBar={false}
                badgeType={BadgeType.AddedBadge}
                overrideSortOptions={OVERRIDE_SORT_SEARCH}
              />
            </div>
          )}
        </span>
      )}

      {searchResults && canLoadMore && (
        <div className="pt-2">
          <Button
            className="h-9 pb-0.5 gap-1"
            onClick={onSeeMore}
            disabled={isFetching}
          >
            {isFetching ||
            (fetchedSearchResults?.page === 2 && searchResults.page === 1) ? (
              <IconLoadingSpinner className="text-blue-100" />
            ) : (
              <IconAdd width={17} />
            )}

            {'See more'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
