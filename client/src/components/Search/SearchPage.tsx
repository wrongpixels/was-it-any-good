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
import { routerPaths } from '../../utils/url-helper';
import SearchPageResults from './SeargPageResults';
import Separator from '../common/Separator';

const SearchPage = (): JSX.Element | null => {
  const navigateTo = useNavigate();
  const [parameters]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const searchTerm: string | null = parameters.get('q');
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

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <SearchIcon
          className="absolute left-0.5 top-1/2 -translate-y-1/2 text-gray-400 mt-0.5"
          sizePadding={5}
        />
        <form onSubmit={handleOnSearch}>
          <InputField
            {...searchField.getProps()}
            className="border pl-7 text-base py-1.5 w-80 shadow-md shadow-black/5"
          />
        </form>
      </div>
      <span className="pt-5">
        {isLoading && <SpinnerPage text={`Searching for "${searchTerm}"...`} />}
        <SearchPageResults results={suggestions} />
      </span>
    </div>
  );
};

export default SearchPage;
