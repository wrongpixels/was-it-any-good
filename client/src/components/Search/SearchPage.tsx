import { JSX, useEffect } from 'react';
import PageResults from './Results/PageResults';
import SearchInputField from './SearchInput';
import {
  searchDropdownOptions,
  searchDropToType,
  SearchType,
  searchTypeArrayToDropdown,
} from '../../../../shared/types/search';
import { useNotificationContext } from '../../context/NotificationProvider';
import { useAnimEngine } from '../../context/AnimationProvider';
import { useSearchQuery } from '../../queries/search-queries';
import useUrlQueryManager from '../../hooks/use-url-query-manager';
import ErrorPage from '../Common/Status/ErrorPage';
import Instructions from '../Common/Instructions';
import { BadgeType } from '../../types/search-browse-types';
import useDropdown from '../../hooks/use-dropdown';
import Dropdown from '../Common/Custom/Dropdown';
import LoadingCards from './Loading/LoadingSearch';
import { OVERRIDE_SORT_SEARCH } from '../../constants/search-browse-constants';
import { getDropdownValue } from '../../../../shared/types/common';
import { setSEO } from '../../utils/set-seo';
import { buildSearchSeo } from '../../utils/page-seo-helpers';
import { clientPaths } from '../../../../shared/util/url-builder';

//SearchPage doesn't use states to track parameters and options, it relies on the active url and its query parameters.
//when adding or removing parameters, the url changes forcing a re-render that repopulates the component's data.
//users can edit the url to get the same results and no API call takes place until Search form is submitted
//or the searchTerm in the url changes.

const SearchPage = (): JSX.Element | null => {
  //a hook shared with BrowsePage that extracts and interprets active url params as state values
  //it allows to navigate to new queries and pages based on active parameters
  const {
    urlParams,
    currentQuery,
    navigatePages,
    navigateToPage,
    navigateToQuery: navigateToNewTerm,
    queryTypeManager,
  } = useUrlQueryManager({ basePath: clientPaths.search.base });
  const { searchTerm, searchPage, queryType } = urlParams;
  const { setNotification, anchorRef } = useNotificationContext();
  const { playAnim } = useAnimEngine();

  console.log(queryType);

  const {
    data: searchResults,
    isFetching,
    isLoading,
    isError,
  } = useSearchQuery(currentQuery || '', searchTerm);

  //to avoid setting a url page number above totalPages or less than 1
  //this is also protected in the backend
  useEffect(() => {
    if (
      !isFetching &&
      !!currentQuery &&
      searchResults &&
      (Number(searchPage) < 1 || searchResults.totalPages < Number(searchPage))
    ) {
      console.log('This was triggered', searchPage, searchResults);
      navigateToPage(
        searchResults.totalPages > 0 ? searchResults.totalPages : 1
      );
    }
  }, [searchPage]);

  useEffect(() => {
    setSEO(buildSearchSeo(searchTerm, currentQuery));
  }, [searchTerm]);

  const toggleParam = (param: string) => {
    queryTypeManager.clearAll();
    queryTypeManager.toggleParamByName(searchDropToType(param));
    if (searchTerm) {
      handleSearch(searchTerm, true);
    }
  };

  const searchDropdown = useDropdown({
    defaultValue: searchTypeArrayToDropdown(queryType),
    name: 'searchType',
    onChanged: toggleParam,
  });
  const searchType: SearchType = searchDropToType(
    getDropdownValue(searchDropdown.value)
  );

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
      //if we haven't searched anything, this is our first search, so we
      //override the searchType with the active dropdown.
      //once we have searched something, the query parameters will be applied automatically
      overrideParams: !searchTerm
        ? {
            searchType,
          }
        : undefined,
    });
  };

  if (isError) {
    return <ErrorPage />;
  }

  const showLoading = isLoading || isFetching;

  return (
    <div className="flex flex-col items-center gap-4 pt-4 flex-1">
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

      {!searchTerm && <Instructions linkToSearch={true} />}

      {showLoading ? (
        <LoadingCards showNavBar={true} />
      ) : (
        <span className="pt-1 w-full flex flex-1">
          {searchResults && searchTerm && (
            <div className="flex flex-1">
              <PageResults
                urlParams={urlParams}
                results={searchResults}
                term={searchTerm || undefined}
                navigateToQuery={navigateToNewTerm}
                navigatePages={navigatePages}
                showNavBar={true}
                badgeType={BadgeType.AddedBadge}
                overrideSortOptions={OVERRIDE_SORT_SEARCH}
              />
            </div>
          )}
        </span>
      )}
    </div>
  );
};

export default SearchPage;
