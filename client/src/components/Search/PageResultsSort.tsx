import { JSX } from 'react';
import {
  invertSortDir,
  isSortBy,
  SortBy,
  sortByValues,
  SortDir,
} from '../../../../shared/types/browse';
import { styles } from '../../constants/tailwind-styles';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import IconInvertSortDir from '../common/icons/sorting/IconInvertSortDir';
import { OverrideParams, URLParameters } from '../../types/search-browse-types';
import useDropdown from '../../hooks/use-dropdown';

//the dropdowns to choose the SortBy and SortDir options
interface PageResultsSortProps {
  showSortOptions: boolean;
  urlParams: URLParameters;
  submitFilter: (overrideParams: OverrideParams) => void;
}

const PageResultsSort = ({
  showSortOptions,
  urlParams,
  submitFilter,
}: PageResultsSortProps): JSX.Element | null => {
  if (!showSortOptions) {
    return null;
  }

  const invertedSortDir: boolean = urlParams.sortDir === SortDir.Inverted;

  const applySortBy = (newValue: string) =>
    submitFilter({
      sortBy: isSortBy(newValue) ? newValue : SortBy.Popularity,
    });

  const toggleSortDir = () =>
    submitFilter({
      sortDir: invertSortDir(urlParams.sortDir),
    });

  const orderDropdown = useDropdown({
    name: 'sortBy',
    defaultValue: urlParams.sortBy || SortBy.Popularity,
    onChanged: applySortBy,
  });
  return (
    <div className="absolute -translate-y-1 flex flex-row gap-2 ">
      <Dropdown
        {...orderDropdown.getProps()}
        options={sortByValues}
        label="Sort by"
      />
      <Button
        title={invertedSortDir ? 'Set default order' : 'Invert default order'}
        variant="dropdown"
        onClick={() => toggleSortDir()}
        className={`p-0 px-1 h-9.25 ${invertedSortDir ? `${styles.buttons.blue}` : ''}`}
      >
        <IconInvertSortDir width={16} />
      </Button>
    </div>
  );
};

export default PageResultsSort;
