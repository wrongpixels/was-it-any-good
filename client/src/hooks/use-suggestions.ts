import { useEffect, useState } from 'react';
import { useSuggestionsQuery } from '../queries/suggestions-queries';

const useSuggestions = (
  searchFieldValue: string,
  disabled: boolean = false
) => {
  const { data: suggestions, isFetching } = useSuggestionsQuery(
    searchFieldValue,
    disabled
  );
  const [isDropdownVisible, setDropdownVisible] = useState(true);
  useEffect(() => {
    if (searchFieldValue) {
      setDropdownVisible(true);
    }
  }, [searchFieldValue, suggestions]);
  return { suggestions, isFetching, isDropdownVisible, setDropdownVisible };
};

export default useSuggestions;
