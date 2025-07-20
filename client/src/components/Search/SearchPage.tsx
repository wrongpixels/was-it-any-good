import { SetURLSearchParams, useSearchParams } from 'react-router-dom';
import { useInputField } from '../../hooks/use-inputfield';
import { InputField } from '../common/InputField';
import { JSX } from 'react';
import { setPageInfo } from '../../utils/page-info-setter';
import SearchIcon from '../Header/Search/icons/SearchIcon';

const SearchPage = (): JSX.Element | null => {
  const [parameters]: [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const searchTerm: string | null = parameters.get('q');
  const searchField = useInputField({
    name: 'search',
    initialValue: searchTerm || undefined,
    placeholder: 'Search on WIAG and TMDB',
  });
  setPageInfo({ title: `${searchTerm ? `${searchTerm} - ` : ''}Search` });
  return (
    <div className="flex justify-center flex-row">
      <div className="relative">
        <SearchIcon
          className="absolute left-0.5 top-1/2 -translate-y-1/2 text-gray-400"
          sizePadding={5}
        />
        <InputField
          {...searchField.getProps()}
          className="border pl-7 text-base border-cyan-400 py-1.5 w-80 shadow-md shadow-black/5"
        />
      </div>
    </div>
  );
};

export default SearchPage;
