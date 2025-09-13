import { FormEvent, memo, useEffect } from 'react';
import { InputField } from '../Common/Custom/InputField';
import { useInputField } from '../../hooks/use-inputfield';
import { OptStringProps } from '../../types/common-props-types';
import Button from '../Common/Custom/Button';
import { AnimatedDiv } from '../Common/Custom/AnimatedDiv';
import useSuggestions from '../../hooks/use-suggestions';
import SearchResults from '../Header/Search/SearchResults';
import SearchIcon from '../Common/Icons/SearchIcon';

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

    const { suggestions, isFetching, isDropdownVisible, setDropdownVisible } =
      useSuggestions(searchField.value);

    const handleOnSearch = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSearch(searchField.value);
    };

    return (
      <div className="relative">
        <form onSubmit={handleOnSearch} className="flex flex-row gap-2">
          <InputField
            {...searchField.getProps()}
            className="border pl-7 h-9 text-xs sm:text-base py-1.5 w-45 sm:w-100 shadow-md shadow-black/5"
          />
          {searchField.value &&
            searchField.value !== searchTerm &&
            isDropdownVisible && (
              <div className="absolute translate-y-10 z-1">
                <SearchResults
                  searchResults={suggestions}
                  isLoading={isFetching}
                  searchValue={searchField.value}
                  onClose={() => setDropdownVisible(false)}
                  cleanField={searchField.reset}
                />
              </div>
            )}
          <SearchIcon
            className="absolute left-0.6 top-1/2 -translate-y-1/2 text-gray-400"
            sizePadding={5}
          />
          <AnimatedDiv animKey={'search-main-button'}>
            <Button type={'submit'} className="pr-3 h-9 text-sm sm:text-xs">
              <SearchIcon
                className="text-gray-100 mt-0.5 sm:-ml-2"
                sizePadding={5}
              />
              <span className="hidden sm:block">{'Search'}</span>
            </Button>
          </AnimatedDiv>
        </form>
      </div>
    );
  }
);

export default SearchInputField;
