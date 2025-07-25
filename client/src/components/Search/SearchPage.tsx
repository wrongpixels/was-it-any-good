import {
  SetURLSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { JSX } from 'react';
import { setPageInfo } from '../../utils/page-info-setter';
import SpinnerPage from '../common/status/SpinnerPage';
import {
  isQueryActiveInUrl,
  normalizeMediaSearchParams,
  routerPaths,
} from '../../utils/url-helper';
import SearchPageResults from './SearchPageResults';
import Button from '../common/Button';
import SearchUrlBuilder from '../../utils/search-url-builder';
import SearchInputField from './SearchInput';
import { SearchType, searchTypes } from '../../../../shared/types/search';
import ParamManager, { ParamStructure } from '../../utils/search-param-manager';
import { styles } from '../../constants/tailwind-styles';
import { capitalize } from '../../utils/common-format-helper';
import { useNotificationContext } from '../../context/NotificationProvider';
import { AnimatedDiv } from '../common/AnimatedDiv';
import { useAnimEngine } from '../../context/AnimationProvider';
import { useSearchQuery } from '../../queries/search-queries';

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
  const searchTerm: string | null = parameters.get('q');
  const activeSearchTypeParams: string[] = normalizeMediaSearchParams(
    parameters.getAll('m')
  );
  const typeFilters = new ParamManager(searchTypes, activeSearchTypeParams);
  const buildSearchQuery = () =>
    searchUrl
      .byTerm(searchTerm)
      .byTypes(typeFilters.getAppliedNames())
      .toString();

  const navigateToCurrentQuery = (replace: boolean = false) =>
    navigateTo(routerPaths.search.byQuery(buildSearchQuery()), { replace });

  const currentQuery: string = buildSearchQuery();

  const { data: searchResults, isLoading } = useSearchQuery(currentQuery || '');
  setPageInfo({ title: `${searchTerm ? `${searchTerm} - ` : ''}Search` });

  //to fix unmatched query parameters on first render
  if (!isQueryActiveInUrl(currentQuery)) {
    navigateToCurrentQuery(true);
  }

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
    console.log('searching', newSearch, searchTerm);
    navigateToCurrentQuery(newSearch === searchTerm);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <SearchInputField
        text={searchTerm || undefined}
        handleSearch={handleSearch}
      />
      <div className="flex flex-row items-center gap-1" ref={anchorRef}>
        <span className="text-gray-400 pr-2">Look for</span>
        {typeFilters.params.map((param: ParamStructure) => (
          <AnimatedDiv key={param.name} animKey={`search-param-${param.name}`}>
            <Button
              onClick={() => toggleParam(param)}
              className={`h-8 flex flex-row gap-1 ${styles.animations.zoomLessOnHover} ${!param.applied ? styles.buttons.dark : ''}`}
            >
              <span className="">{`${!param.applied ? '☐' : '☑'}`}</span>
              {capitalize(param.name)}
            </Button>
          </AnimatedDiv>
        ))}
      </div>
      <span className="pt-5">
        {isLoading && <SpinnerPage text={`Searching for "${searchTerm}"...`} />}
        {searchResults && searchTerm && (
          <SearchPageResults results={searchResults} term={searchTerm} />
        )}
      </span>
    </div>
  );
};

export default SearchPage;
