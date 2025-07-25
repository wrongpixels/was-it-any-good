import {
  SetURLSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { JSX, useEffect } from 'react';
import { setPageInfo } from '../../utils/page-info-setter';
import { useSuggestionsQuery } from '../../queries/suggestions-queries';
import SpinnerPage from '../common/status/SpinnerPage';
import {
  getURLAfterDomain,
  normalizeMediaSearchParams,
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
  if (activeSearchTypeParams.length === 0) {
    activeSearchTypeParams.push(SearchType.Film, SearchType.Show);
  }
  const typeFilters = new ParamManager(searchTypes, activeSearchTypeParams);
  /*
  const genreFilters: string[] = parameters.getAll('g');
  const orderFilter: string = parameters.get('orderBy') || '';
  const sortFilter: string = parameters.get('sortBy') || '';*/

  const { data: suggestions, isLoading } = useSuggestionsQuery(
    searchTerm || ''
  );
  setPageInfo({ title: `${searchTerm ? `${searchTerm} - ` : ''}Search` });

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

  //on first render, we remove invalid and unmatched parameters.
  useEffect(() => {
    const currentUrl: string = searchUrl
      .byTerm(searchTerm)
      .byTypes(typeFilters.getAppliedNames())
      .toString();
    if (currentUrl !== getURLAfterDomain()) {
      navigateTo(currentUrl), { replace: true };
    }
  }, []);

  const handleSearch = (newSearch: string | null) => {
    console.log('searching', newSearch, searchTerm);
    if (newSearch !== searchTerm) {
      console.log('Adding to history');
    }
    navigateTo(
      searchUrl
        .byTerm(newSearch)
        .byTypes(typeFilters.getAppliedNames())
        .toString(),
      { replace: newSearch === searchTerm }
    );
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
          <AnimatedDiv animKey={`search-param-${param.name}`}>
            <Button
              key={param.name}
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
        {suggestions && searchTerm && (
          <SearchPageResults results={suggestions} term={searchTerm} />
        )}
      </span>
    </div>
  );
};

export default SearchPage;
