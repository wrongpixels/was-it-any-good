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
import SearchUrlBuilder, { SearchType } from '../../utils/search-url-builder';
import SearchInputField from './SearchInput';

const SearchPage = (): JSX.Element | null => {
  const navigateTo = useNavigate();
  const searchUrl: SearchUrlBuilder = new SearchUrlBuilder();
  const [parameters]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const searchTerm: string | null = parameters.get('q');
  const mediaTypeFilters: string[] = normalizeMediaSearchParams(
    parameters.getAll('m')
  );
  const genreFilters: string[] = parameters.getAll('g');
  const orderFilter: string = parameters.get('orderBy') || '';
  const sortFilter: string = parameters.get('sortBy') || '';
  console.log(mediaTypeFilters);

  const { data: suggestions, isLoading } = useSuggestionsQuery(
    searchTerm || ''
  );
  setPageInfo({ title: `${searchTerm ? `${searchTerm} - ` : ''}Search` });

  const toggleTypeFilter = (searchType: SearchType) => {
    const index = mediaTypeFilters.indexOf(searchType);
    if (index === -1) {
      mediaTypeFilters.push(searchType);
    } else {
      mediaTypeFilters.splice(index, 1);
    }
    navigateTo(
      searchUrl.byTerm(searchTerm).byTypes(mediaTypeFilters).toString()
    );
  };
  console.log('refresh');

  return (
    <div className="flex flex-col items-center gap-4">
      <SearchInputField text={searchTerm || undefined} />
      <div className="flex flex-row items-center gap-1">
        <span className="text-gray-400 pr-2">Filter by</span>
        <Button onClick={() => toggleTypeFilter('film')} className="h-8">
          + Films
        </Button>
        <Button onClick={() => toggleTypeFilter('show')} className="h-8">
          + TV
        </Button>
        <Button className="h-8">+ People</Button>
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
