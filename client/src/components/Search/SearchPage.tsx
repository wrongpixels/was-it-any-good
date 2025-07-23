import {
  SetURLSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { JSX } from 'react';
import { setPageInfo } from '../../utils/page-info-setter';
import { useSuggestionsQuery } from '../../queries/suggestions-queries';
import SpinnerPage from '../common/status/SpinnerPage';
import { normalizeMediaSearchParams } from '../../utils/url-helper';
import SearchPageResults from './SearchPageResults';
import Button from '../common/Button';
import SearchUrlBuilder from '../../utils/search-url-builder';
import SearchInputField from './SearchInput';
import { searchTypes } from '../../../../shared/types/search';
import ParamManager, { ParamStructure } from '../../utils/search-param-manager';
import { styles } from '../../constants/tailwind-styles';
import { capitalize } from '../../utils/common-format-helper';

const SearchPage = (): JSX.Element | null => {
  const navigateTo = useNavigate();
  const searchUrl: SearchUrlBuilder = new SearchUrlBuilder();
  const [parameters]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const searchTerm: string | null = parameters.get('q');
  const typeFilters = new ParamManager(
    searchTypes,
    normalizeMediaSearchParams(parameters.getAll('m'))
  );

  const genreFilters: string[] = parameters.getAll('g');
  const orderFilter: string = parameters.get('orderBy') || '';
  const sortFilter: string = parameters.get('sortBy') || '';

  const { data: suggestions, isLoading } = useSuggestionsQuery(
    searchTerm || ''
  );
  setPageInfo({ title: `${searchTerm ? `${searchTerm} - ` : ''}Search` });

  const toggleParam = (param: ParamStructure) => {
    typeFilters.toggleParam(param);
    console.log('refresh', param);
    navigateTo(searchUrl.byTypes(typeFilters.getAppliedParams()).toString());
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <SearchInputField text={searchTerm || undefined} />
      <div className="flex flex-row items-center gap-1">
        <span className="text-gray-400 pr-2">Filter by</span>
        {typeFilters.params.map((param: ParamStructure) => (
          <Button
            key={param.name}
            onClick={() => toggleParam(param)}
            className={`h-8 flex flex-row gap-1 ${styles.animations.zoomLessOnHover} ${param.applied ? styles.buttons.dark : ''}`}
          >
            <span className="w-3">{`${param.applied ? '-' : '+'}`}</span>
            {capitalize(param.name)}
          </Button>
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
