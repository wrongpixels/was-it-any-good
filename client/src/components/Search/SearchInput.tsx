import { FormEvent, memo, useEffect } from 'react';
import { InputField } from '../common/InputField';
import SearchIcon from '../Header/Search/icons/SearchIcon';
import { useInputField } from '../../hooks/use-inputfield';
import { OptStringProps } from '../../types/common-props-types';
import Button from '../common/Button';

interface SearchInputFieldProps extends OptStringProps {
  handleSearch: (newSearch: string | null) => void;
}

const SearchInputField = memo(
  ({ text: searchTerm, handleSearch }: SearchInputFieldProps) => {
    const searchField = useInputField({
      name: 'main-search',
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
          className="absolute left-0.6 top-1/2 -translate-y-1/2 text-gray-400 mt-0.5"
          sizePadding={5}
        />
        <form onSubmit={handleOnSearch} className="flex flex-row gap-2">
          <InputField
            {...searchField.getProps()}
            className="border pl-7 text-base py-1.5 w-100 shadow-md shadow-black/5"
          />
          <Button type={'submit'} className="pr-3 h-9">
            <SearchIcon
              className="text-gray-100 mt-0.5 -ml-2"
              sizePadding={5}
            />
            Search
          </Button>
        </form>
      </div>
    );
  }
);

export default SearchInputField;
