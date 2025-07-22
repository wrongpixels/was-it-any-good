import {
  SetURLSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useInputField } from '../../hooks/use-inputfield';
import { InputField } from '../common/InputField';
import { FormEvent, JSX } from 'react';
import { setPageInfo } from '../../utils/page-info-setter';
import SearchIcon from '../Header/Search/icons/SearchIcon';
import { useSuggestionsQuery } from '../../queries/suggestions-queries';
import SpinnerPage from '../common/status/SpinnerPage';
import {
  normalizeMediaSearchParams,
  routerPaths,
} from '../../utils/url-helper';
import SearchPageResults from './SearchPageResults';
import Button from '../common/Button';
import SearchUrlBuilder, { SearchType } from '../../utils/search-url-builder';

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

  const searchField = useInputField({
    name: 'search',
    initialValue: searchTerm || undefined,
    placeholder: 'Search on WIAG and TMDB',
  });
  const { data: suggestions, isLoading } = useSuggestionsQuery(
    searchTerm || ''
  );
  setPageInfo({ title: `${searchTerm ? `${searchTerm} - ` : ''}Search` });
  const handleOnSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateTo(routerPaths.search.byTerm(searchField.value));
  };

  const toggleTypeFilter = (searchType: SearchType) => {
    const index = mediaTypeFilters.indexOf(searchType);
    if (index === -1) {
      mediaTypeFilters.push(searchType);
    } else {
      mediaTypeFilters.splice(index, 1);
    }
    navigateTo(
      searchUrl.byTerm(searchField.value).byTypes(mediaTypeFilters).toString()
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <SearchIcon
          className="absolute left-0.5 top-1/2 -translate-y-1/2 text-gray-400 mt-0.5"
          sizePadding={5}
        />
        <form onSubmit={handleOnSearch}>
          <InputField
            {...searchField.getProps()}
            className="border pl-7 text-base py-1.5 w-100 shadow-md shadow-black/5"
          />
        </form>
      </div>
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
