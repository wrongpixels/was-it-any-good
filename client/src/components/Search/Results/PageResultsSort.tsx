import { JSX } from 'react';
import {
  invertSortDir,
  isSortBy,
  sortByValues,
  SortDir,
} from '../../../../../shared/types/browse';
import { styles } from '../../../constants/tailwind-styles';
import Button from '../../Common/Custom/Button';
import Dropdown from '../../Common/Custom/Dropdown';
import {} from '../../../types/search-browse-types';
import useDropdown from '../../../hooks/use-dropdown';
import IconInvertSortDir from '../../Common/Icons/Sorting/IconInvertSortDir';
import DisabledDiv from '../../Common/Custom/DisabledDiv';
import {
  OverrideParams,
  URLParameters,
} from '../../../../../shared/types/search-browse';
import {
  DropdownOption,
  getDropdownValue,
} from '../../../../../shared/types/common';
import { DEF_SORT_BY } from '../../../../../shared/constants/url-param-constants';

//a special set of rules to override the default sort options in the BrowsePage
export interface OverrideSortOptions {
  //to hide the sort dropdown (like in Home)
  hideSortBar?: boolean;
  //to replace the default Sort options with a cosmetic custom one,
  //like for TMDB search (Relevance) and hardcoded sorting pages like Tops (always Rating)
  defaultOption?: string;
  overrideOptions?: DropdownOption[];

  //to disable the SortBy dropdown
  canSort?: boolean;
  //to disable the invert button in certain cases (TMDB Search)
  canInvert?: boolean;
}

//the dropdowns to choose the SortBy and SortDir options
interface PageResultsSortProps {
  urlParams: URLParameters;
  overrideSortOptions?: OverrideSortOptions;
  overrideParams?: OverrideParams;
  submitFilter: (overrideParams: OverrideParams) => void;
}

const PageResultsSort = ({
  urlParams,
  overrideSortOptions,
  overrideParams,
  submitFilter,
}: PageResultsSortProps): JSX.Element | null => {
  if (overrideSortOptions?.hideSortBar) {
    return null;
  }

  const canInvert: boolean = overrideSortOptions?.canInvert ?? true;
  const canSort: boolean = overrideSortOptions?.canSort ?? true;

  //we use the default universal params, but if we override them correctly,
  //we'll use them instead
  const sortOptions: DropdownOption[] =
    overrideSortOptions?.overrideOptions ?? sortByValues;

  //if we provided a default values, we'll use it, if not, if we provided
  //a valid array of options, we'll use index 0, if not, our global defaults
  const defaultOption: DropdownOption =
    urlParams.sortBy ??
    overrideParams?.sortBy ??
    overrideSortOptions?.defaultOption ??
    overrideSortOptions?.overrideOptions?.[0] ??
    DEF_SORT_BY;

  const invertedSortDir: boolean = urlParams.sortDir === SortDir.Inverted;

  const applySortBy = (newValue: DropdownOption): void => {
    const value: string = getDropdownValue(newValue);
    submitFilter({
      sortBy: isSortBy(value) ? value : DEF_SORT_BY,
    });
  };

  const toggleSortDir = () =>
    submitFilter({
      sortDir: invertSortDir(urlParams.sortDir),
    });

  const orderDropdown = useDropdown({
    name: 'sortBy',
    defaultValue: defaultOption,
    onChanged:
      overrideSortOptions?.overrideOptions?.length === 1
        ? undefined
        : applySortBy,
  });
  return (
    <div className="absolute -translate-y-1 flex flex-row gap-2 ">
      <DisabledDiv disabled={!canSort}>
        <Dropdown
          {...orderDropdown.getProps()}
          options={sortOptions}
          label="Sort by"
        />
      </DisabledDiv>
      <DisabledDiv disabled={!canInvert}>
        <Button
          title={invertedSortDir ? 'Set default order' : 'Invert default order'}
          variant="dropdown"
          onClick={() => toggleSortDir()}
          className={`p-0 px-1 h-9.25 ${invertedSortDir ? `${styles.buttons.blue}` : ''}`}
        >
          <IconInvertSortDir width={16} />
        </Button>
      </DisabledDiv>
    </div>
  );
};

export default PageResultsSort;
