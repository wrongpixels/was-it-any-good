import { JSX, useMemo } from 'react';
import {
  IndexMediaData,
  IndexMediaResponse,
} from '../../../../shared/types/models';
import SearchCard from './SearchCard';

import { PAGE_LENGTH } from '../../../../shared/types/search-browse';
import PageResultsNav from './PageResultsNav';
import Instructions from '../common/Instructions';
import {
  BadgeType,
  OverrideParams,
  URLParameters,
} from '../../types/search-browse-types';
import {
  isSortBy,
  isSortDir,
  SortBy,
  sortByValues,
  SortDir,
  SortDirDropdown,
  sortDirDropdown,
  sortDirDropdownToSortDir,
} from '../../../../shared/types/browse';
import Dropdown from '../common/Dropdown';
import useDropdown from '../../hooks/use-dropdown';
import { queryTypeToDisplayName } from '../../utils/url-helper';
import IconDirectionAZ from '../common/icons/sorting/IconDirectionAZ';
import IconDirectionZA from '../common/icons/sorting/IconDirectionZA';
import { NavigateToQueryOptions } from '../../hooks/use-url-query-manager';
import { replace } from 'react-router-dom';

interface PageResultsProps {
  results: IndexMediaResponse | undefined;
  navigatePages: (movement: number) => void;
  navigateToQuery: (options: NavigateToQueryOptions) => void;
  urlParams: URLParameters;
  term?: string;
  title?: string;
  badgeType: BadgeType;
  showNavBar?: boolean;
  showOrderOptions?: boolean;
}
//we render here the results, shared between Search and Browse
const PageResults = ({
  results,
  urlParams,
  term,
  navigateToQuery,
  navigatePages,
  badgeType = BadgeType.None,
  showNavBar = true,
  showOrderOptions = true,
}: PageResultsProps): JSX.Element | null => {
  if (!results) {
    return null;
  }
  console.log(urlParams);
  const submitFilter = (overrideParams: OverrideParams) => {
    navigateToQuery({ replace: true, overrideParams });
  };

  const applySorByFilter = (newValue: string) =>
    submitFilter({
      sortBy: isSortBy(newValue) ? newValue : SortBy.Popularity,
    });

  const applySortDirFilter = (newValue: string) =>
    submitFilter({
      sortDir: sortDirDropdownToSortDir(newValue),
    });
  const orderDropdown = useDropdown({
    name: 'sortBy',
    defaultValue: urlParams.sortBy || SortBy.Popularity,
    onChanged: applySorByFilter,
  });

  const directionDropdown = useDropdown({
    name: 'sortDir',
    defaultValue: urlParams.sortDir || SortDirDropdown.DESC,
    onChanged: applySortDirFilter,
  });
  const searchTerm = (): JSX.Element => (
    <>
      {' for '}
      <span className="italic text-gray-500 font-normal">"{term}"</span>
    </>
  );
  const indexOffset: number = (results.page - 1) * PAGE_LENGTH + 1;
  //we memo the list of result Cards for performance
  const resultEntries: JSX.Element[] = useMemo(
    () =>
      results.indexMedia.map((im: IndexMediaData, index: number) => (
        <SearchCard
          key={im.id}
          media={im}
          index={index + indexOffset}
          badgeType={badgeType}
        />
      )),
    [results, badgeType]
  );
  console.log(directionDropdown.value);
  return (
    <div className="flex flex-col font-medium gap-5 flex-1">
      {showNavBar && (
        <>
          <div className="relative w-full h-8 flex flex-row">
            <span className="w-full text-center text-lg">
              {results.totalResults || 'No'}
              {` ${queryTypeToDisplayName(urlParams.queryType)} `}
              {' results '}
              <>{term && searchTerm()}</>
            </span>
            <PageResultsNav results={results} navigatePages={navigatePages} />
          </div>
          {showOrderOptions && (
            <div className="absolute -translate-y-1 flex flex-row gap-2 ">
              <Dropdown
                {...orderDropdown.getProps()}
                options={sortByValues}
                label="Sort by"
              />
              <Dropdown
                {...directionDropdown.getProps()}
                options={sortDirDropdown}
                className="w-7.5 relative"
              >
                {(directionDropdown.value === SortDir.Descending && (
                  <IconDirectionAZ className="w-3 text-gray-600 absolute bg-gray-200 translate-x-1 -translate-y-0.75 pointer-events-none" />
                )) || (
                  <IconDirectionZA className="w-3 text-gray-600 absolute bg-gray-200 translate-x-1 -translate-y-0.75 pointer-events-none" />
                )}
              </Dropdown>
            </div>
          )}
        </>
      )}
      <span className="flex-1">
        {results.indexMedia.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">{resultEntries}</div>
        ) : (
          <div className="h-64 w-full" aria-hidden="true">
            <Instructions condition={true} />
          </div>
        )}
      </span>
      {showNavBar && (
        <span className="relative w-full mt-5 mb-2 h-fit">
          <PageResultsNav results={results} navigatePages={navigatePages} />
        </span>
      )}
    </div>
  );
};

export default PageResults;
