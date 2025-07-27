import {
  SetURLSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { JSX, useEffect } from 'react';
import { setPageInfo } from '../../utils/page-info-setter';
import SpinnerPage from '../common/status/SpinnerPage';
import {
  isQueryActiveInUrl,
  normalizeMediaSearchParams,
  routerPaths,
} from '../../utils/url-helper';
import SearchPageResults from './SearchPageResults';
import SearchUrlBuilder from '../../utils/search-url-builder';
import SearchInputField from './SearchInput';
import { SearchType, searchTypes } from '../../../../shared/types/search';
import ParamManager, { ParamStructure } from '../../utils/search-param-manager';
import { capitalize } from '../../utils/common-format-helper';
import { useNotificationContext } from '../../context/NotificationProvider';
import { useAnimEngine } from '../../context/AnimationProvider';
import { useSearchQuery } from '../../queries/search-queries';
import SearchParams from './SearchParams';

interface SearchQueryOpts {
  newQuery?: string;
  newPage?: number;
}

//SearchPage doesn't use states to track parameters and options, it relies on the active url and its queries.
//when adding or removing parameters, the url changes forcing a re-render that repopulates the component's data.
//users can edit the url to get the same results and no API call takes place until Search form is submitted
//or the searchTerm in the url changes.

const SearchPage = (): JSX.Element | null => {
  const navigateTo = useNavigate();
  const { setNotification, anchorRef } = useNotificationContext();
  const { playAnim } = useAnimEngine();
  const searchUrl: SearchUrlBuilder = new SearchUrlBuilder();

  const [parameters]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const currentPage: number = Number(parameters.get('page'));
  const activeSearchTypeParams: string[] = normalizeMediaSearchParams(
    parameters.getAll('m')
  );
  const searchTerm: string | null = parameters.get('q');

  const typeFilters = new ParamManager(searchTypes, activeSearchTypeParams);
  const buildSearchQuery = ({ newQuery, newPage }: SearchQueryOpts) => {
    console.log(newPage);
    const url = searchUrl
      .byTerm(newQuery || searchTerm)
      .byTypes(typeFilters.getAppliedNames())
      .toPage(newPage)
      .toString();

    console.log(url);
    return url;
  };

  const navigateToCurrentQuery = (replace: boolean = false, page: number = 1) =>
    navigateTo(
      routerPaths.search.byQuery(buildSearchQuery({ newPage: page })),
      { replace }
    );
  const navigateToNewQuery = (
    newQuery: string | undefined,
    replace: boolean = false
  ) =>
    navigateTo(routerPaths.search.byQuery(buildSearchQuery({ newQuery })), {
      replace,
    });

  const currentQuery: string = buildSearchQuery({ newPage: currentPage });

  const { data: searchResults, isLoading } = useSearchQuery(
    currentQuery || '',
    searchTerm
  );
  const navigatePage = (movement: number) => {
    if (!searchResults) {
      return;
    }
    const nextPosition: number = (currentPage || 1) + movement;
    const nextPage: number = Math.min(
      Math.max(1, nextPosition),
      searchResults.totalPages
    );
    navigateToCurrentQuery(false, nextPage);
  };
  setPageInfo({ title: `${searchTerm ? `${searchTerm} - ` : ''}Search` });

  //to fix unmatched query parameters on first render
  useEffect(() => {
    if (searchTerm && !isQueryActiveInUrl(currentQuery)) {
      console.log(currentQuery);
      // navigateToCurrentQuery(true), [searchTerm];
    }
  });

  useEffect(() => {
    if (searchResults && searchResults.totalPages < Number(currentPage)) {
      console.log(currentPage);
      navigateToCurrentQuery(true, searchResults.totalPages), [searchResults];
    }
  });

  const toggleParam = (param: ParamStructure) => {
    let alertMessage: string = '';
    if (param.applied && typeFilters.getApplied().length === 1) {
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
    typeFilters.toggleParam(param);
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
    navigateToNewQuery(newSearch || undefined, newSearch === searchTerm);
  };

  return (
    <div className="flex flex-col items-center gap-4 pt-5">
      <SearchInputField
        text={searchTerm || undefined}
        handleSearch={handleSearch}
      />
      <SearchParams
        ref={anchorRef}
        toggleParam={toggleParam}
        typeFilters={typeFilters}
      />
      <span className="pt-2">
        {isLoading && <SpinnerPage text={`Searching for "${searchTerm}"...`} />}
        {searchResults && searchTerm && (
          <SearchPageResults
            results={searchResults}
            term={searchTerm}
            navigatePage={navigatePage}
          />
        )}
      </span>
    </div>
  );
};

export default SearchPage;
