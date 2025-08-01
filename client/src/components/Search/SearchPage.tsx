import { JSX, useEffect } from 'react';
import { setPageInfo } from '../../utils/page-info-setter';
import SpinnerPage from '../common/status/SpinnerPage';
import { routerPaths } from '../../utils/url-helper';
import PageResults from './PageResults';
import SearchInputField from './SearchInput';
import { SearchType } from '../../../../shared/types/search';
import { ParamStructure } from '../../utils/search-param-manager';
import { capitalize } from '../../utils/common-format-helper';
import { useNotificationContext } from '../../context/NotificationProvider';
import { useAnimEngine } from '../../context/AnimationProvider';
import { useSearchQuery } from '../../queries/search-queries';
import SearchParams from './SearchParams';
import useUrlQueryManager from '../../hooks/use-url-query-manager';
import ErrorPage from '../common/status/ErrorPage';

//SearchPage doesn't use states to track parameters and options, it relies on the active url and its queries.
//when adding or removing parameters, the url changes forcing a re-render that repopulates the component's data.
//users can edit the url to get the same results and no API call takes place until Search form is submitted
//or the searchTerm in the url changes.

const SearchPage = (): JSX.Element | null => {
  //a hook shared with BrowsePage to interpret the active url as states
  //and navigate to new queries and result pages based on active parameters
  const {
    searchTerm,
    currentQuery,
    navigatePages,
    navigateToPage,
    navigateToNewTerm,
    currentPage,
    queryTypeManager,
  } = useUrlQueryManager(routerPaths.search.query());

  const { setNotification, anchorRef } = useNotificationContext();
  const { playAnim } = useAnimEngine();

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(currentQuery || '', searchTerm);
  //to avoid setting a url bigger than totalPages or less than 1
  //this is also protected in the backend
  useEffect(() => {
    if (
      currentPage <= 0 ||
      (searchResults && searchResults.totalPages < Number(currentPage))
    ) {
      navigateToPage(searchResults?.totalPages || 1);
    }
  }, [searchResults]);

  setPageInfo({ title: `${searchTerm ? `${searchTerm} - ` : ''}Search` });

  const toggleParam = (param: ParamStructure) => {
    let alertMessage: string = '';
    if (param.applied && queryTypeManager.getApplied().length === 1) {
      alertMessage = 'Select at least one!';
    }
    if (param.name === SearchType.Person) {
      alertMessage = `Search for ${capitalize(SearchType.Person)}\nnot implemented yet! 😔`;
    }

    if (alertMessage) {
      setNotification({
        message: alertMessage,
        anchorRef,
      });
      playAnim({
        animationClass: 'animate-shake',
        animKey: `search-param-${param.name}`,
      });
      return;
    }
    queryTypeManager.toggleParam(param);
    console.log('refresh', param);
    handleSearch(searchTerm);
  };

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
    navigateToNewTerm(newSearch || undefined, newSearch === searchTerm);
  };

  if (isError || searchResults === null) {
    <ErrorPage />;
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-5">
      <SearchInputField
        text={searchTerm || undefined}
        handleSearch={handleSearch}
      />
      <SearchParams
        ref={anchorRef}
        toggleParam={toggleParam}
        typeFilters={queryTypeManager}
      />
      <span className="pt-1 w-full">
        {isLoading && (
          <SpinnerPage
            text={`Searching for "${searchTerm}"...`}
            paddingTop={0}
          />
        )}
        {searchResults && searchTerm && (
          <PageResults
            results={searchResults}
            term={searchTerm}
            navigatePages={navigatePages}
          />
        )}
      </span>
    </div>
  );
};

export default SearchPage;
