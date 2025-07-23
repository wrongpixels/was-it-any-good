import { FormEvent, memo, useEffect } from 'react';
import { InputField } from '../common/InputField';
import SearchIcon from '../Header/Search/icons/SearchIcon';
import { useInputField } from '../../hooks/use-inputfield';
import { OptStringProps } from '../../types/common-props-types';

interface SearchInputFieldProps extends OptStringProps {
  handleSearch: (newSearch: string | null) => void;
}

const SearchInputField = memo(
  ({ text: searchTerm, handleSearch }: SearchInputFieldProps) => {
    const searchField = useInputField({
      name: 'search',
      initialValue: searchTerm || undefined,
      placeholder: 'Search on WIAG and TMDB',
    });

    useEffect(() => {
      searchField.setValue(searchTerm || '');
    }, [searchTerm]);

    const handleOnSearch = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSearch(searchField.value);
    };

    return (
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
    );
  }
);

export default SearchInputField;
