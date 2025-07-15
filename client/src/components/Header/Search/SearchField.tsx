import { JSX, useEffect, useState } from 'react';
import { useInputField } from '../../../hooks/use-inputfield';
import SearchResults from './SearchResults';
import { useSuggestionsQuery } from '../../../queries/suggestions-queries';
import SearchIcon from './icons/SearchIcon';
import { InputField } from '../../common/InputField';

const SearchField = (): JSX.Element => {
  const [isDropdownVisible, setDropdownVisible] = useState(true);
  const searchField = useInputField({
    name: 'search',
    placeholder: 'Films, shows...',
  });
  const { data: suggestions } = useSuggestionsQuery(searchField.value);

  useEffect(() => {
    if (searchField.value) {
      setDropdownVisible(true);
    }
  }, [searchField.value, suggestions]);

  return (
    <div className="flex gap-2">
      <span className="absolute text-gray-400 ml-0.5 mt-0.5 items-center">
        <SearchIcon active={!!searchField.value} />
      </span>
      <InputField {...searchField.getProps()} className="pl-7" />
      {searchField.value && isDropdownVisible && (
        <div className="absolute translate-y-7 -translate-x-2.5">
          <SearchResults
            searchResults={suggestions}
            searchValue={searchField.value}
            onClose={() => setDropdownVisible(false)}
            cleanField={searchField.reset}
          />
        </div>
      )}
    </div>
  );
};

export default SearchField;
