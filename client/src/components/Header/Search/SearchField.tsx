import { JSX } from 'react';
import { useInputField } from '../../../hooks/use-input-field';
import SearchResults from './SearchResults';
import SearchIcon from '../../Common/Icons/SearchIcon';
import { InputField } from '../../Common/Custom/InputField';
import { styles } from '../../../constants/tailwind-styles';
import useSuggestions from '../../../hooks/use-suggestions';
import { useNavigate } from 'react-router-dom';
import { clientPaths } from '../../../../../shared/util/url-builder';
import useDebounce from '../../../hooks/use-debounce';

interface SearchFieldProps {
  fieldName: string;
}

const SearchField = ({ fieldName }: SearchFieldProps): JSX.Element => {
  const [queryDisabled, setDebounce] = useDebounce();
  const searchField = useInputField({
    name: `${fieldName}-search-suggestions`,
    placeholder: 'Films, shows...',
    onChange: setDebounce,
  });
  const { suggestions, isFetching, isDropdownVisible, setDropdownVisible } =
    useSuggestions(searchField.value, queryDisabled);
  const navigate = useNavigate();
  return (
    <div className="flex gap-2">
      <InputField
        {...searchField.getProps()}
        className={`pl-7 ${styles.inputField.header} relative`}
      />
      <SearchIcon
        condition={!!searchField.value}
        className="absolute text-gray-400 ml-0.5 my-0.75"
      />
      {searchField.value && isDropdownVisible && (
        <div className="absolute translate-y-8 -translate-x-2.5">
          <SearchResults
            handleSearch={(value: string | null) => {
              if (value) {
                navigate(clientPaths.search.byTerm(value));
              }
            }}
            searchResults={suggestions}
            isLoading={isFetching || queryDisabled}
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
