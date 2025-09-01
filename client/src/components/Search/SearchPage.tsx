import { JSX, useEffect } from 'react';
import { setPageInfo } from '../../utils/page-info-setter';
import SpinnerPage from '../common/status/SpinnerPage';
import { routerPaths } from '../../utils/url-helper';
import PageResults from './PageResults';
import SearchInputField from './SearchInput';
import {
  SearchDropDown,
  searchDropdownOptions,
  searchDropToType,
  SearchType,
} from '../../../../shared/types/search';
import { useNotificationContext } from '../../context/NotificationProvider';
import { useAnimEngine } from '../../context/AnimationProvider';
import { useSearchQuery } from '../../queries/search-queries';
import useUrlQueryManager from '../../hooks/use-url-query-manager';
import ErrorPage from '../common/status/ErrorPage';
import { useTrendingQuery } from '../../queries/trending-queries';
import EntryTitle from '../EntryTitle';
import IconTrending from '../common/icons/sorting/IconTrending';
import Instructions from '../common/Instructions';
import { BadgeType } from '../../types/search-browse-types';
import useDropdown from '../../hooks/use-dropdown';
import Dropdown from '../common/Dropdown';

//SearchPage doesn't use states to track parameters and options, it relies on the active url and its query parameters.
//when adding or removing parameters, the url changes forcing a re-render that repopulates the component's data.
//users can edit the url to get the same results and no API call takes place until Search form is submitted
//or the searchTerm in the url changes.

interface SearchPageProps {
  isHome?: boolean;
}

const SearchPage = ({ isHome }: SearchPageProps): JSX.Element | null => {
  //a hook shared with BrowsePage that extracts and interprets active url params as state values
  //it allows to navigate to new queries and pages based on active parameters
  const {
    urlParams,
    currentQuery,
    navigatePages,
    navigateToPage,
    navigateToQuery: navigateToNewTerm,
    queryTypeManager,
  } = useUrlQueryManager({ basePath: routerPaths.search.base });
  const { searchTerm, currentPage } = urlParams;
  const { setNotification, anchorRef } = useNotificationContext();
  const { playAnim } = useAnimEngine();
  const toggleParam = (param: string) => {
    queryTypeManager.clearAll();
    queryTypeManager.toggleParamByName(searchDropToType(param));
    if (!urlParams.searchTerm) {
      return;
    }
    handleSearch(searchTerm, true);
  };
  const searchDropdown = useDropdown<SearchDropDown>({
    defaultValue: SearchDropDown.All,
    name: 'searchType',
    onChanged: toggleParam,
  });
  const searchType: SearchType = searchDropToType(searchDropdown.value);

  const {
    data: searchResults,
    isFetching: isLoading,
    isError,
  } = !isHome
    ? useSearchQuery(currentQuery || '', searchTerm)
    : useTrendingQuery();
  //to avoid setting a url page number above totalPages or less than 1
  //this is also protected in the backend
  useEffect(() => {
    if (
      !isHome &&
      !!currentQuery &&
      (currentPage <= 0 ||
        (searchResults && searchResults.totalPages < Number(currentPage)))
    ) {
      navigateToPage(searchResults?.totalPages || 1);
    }
  }, [searchResults]);
  if (isHome) {
    setPageInfo({ title: 'Home' });
  } else {
    setPageInfo({ title: `${searchTerm ? `${searchTerm} - ` : ''}Search` });
  }

  const handleSearch = (
    newSearch: string | null,
    skipCheck: boolean = false
  ) => {
    if (!newSearch && !skipCheck) {
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
    navigateToNewTerm({
      newTerm: newSearch || undefined,
      replace: newSearch === searchTerm,
      //if we  haven't searched anything, this is our first search, so we
      //override the searchType with the active dropdown.
      //once we have searched something, the query parameters will be applied automatically
      overrideParams: !searchTerm
        ? {
            searchType,
          }
        : undefined,
    });
  };

  if (isError || searchResults === null) {
    <ErrorPage />;
  }
  return (
    <div className="flex flex-col items-center gap-4 pt-5 flex-1">
      <span className="flex flex-row gap-2">
        <Dropdown
          {...searchDropdown.getProps()}
          options={searchDropdownOptions}
        />
        <SearchInputField
          text={searchTerm || undefined}
          handleSearch={handleSearch}
        />
      </span>

      {isHome && (
        <>
          <Instructions />
          <span className="w-full -mt-4">
            <EntryTitle
              title={'Trending in TMDB'}
              icon={<IconTrending className={'text-gold'} height={24} />}
            />
          </span>
        </>
      )}
      {isLoading && (
        <SpinnerPage
          text={isHome ? 'Loading...' : `Searching for "${searchTerm}"...`}
          paddingTop={2}
        />
      )}
      <span className="pt-1 w-full flex flex-1">
        {searchResults && (searchTerm || isHome) && (
          <div className="flex flex-1">
            <PageResults
              urlParams={urlParams}
              results={searchResults}
              term={searchTerm || undefined}
              navigateToQuery={navigateToNewTerm}
              navigatePages={navigatePages}
              showNavBar={!isHome}
              badgeType={BadgeType.AddedBadge}
            />
          </div>
        )}
      </span>
    </div>
  );
};

export default SearchPage;
