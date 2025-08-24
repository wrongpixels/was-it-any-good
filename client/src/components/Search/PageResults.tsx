import { JSX, useMemo } from 'react';
import {
  IndexMediaData,
  IndexMediaResponse,
} from '../../../../shared/types/models';
import SearchCard from './SearchCard';

import { PAGE_LENGTH } from '../../../../shared/types/search-browse';
import PageResultsNav from './PageResultsNav';
import Instructions from '../common/Instructions';
import { BadgeType } from '../../types/search-browse-types';
import { OrderBy, orderByValues } from '../../../../shared/types/browse';
import Dropdown from '../common/Dropdown';
import useDropdown from '../../hooks/use-dropdown';

interface PageResultsProps {
  results: IndexMediaResponse | undefined;
  navigatePages: (movement: number) => void;
  term?: string;
  title?: string;
  badgeType: BadgeType;
  showNavBar?: boolean;
  showOrderOptions?: boolean;
}

const PageResults = ({
  results,
  term,
  navigatePages,
  badgeType = BadgeType.None,
  showNavBar = true,
  showOrderOptions = true,
}: PageResultsProps): JSX.Element | null => {
  if (!results) {
    return null;
  }
  const orderDropdown = useDropdown({
    name: 'orderBy',
    defaultValue: OrderBy.Popularity,
  });
  const searchTerm = (): JSX.Element => (
    <>
      {' for '}
      <span className="italic text-gray-500 font-normal pl-1">"{term}"</span>
    </>
  );
  const indexOffset: number = (results.page - 1) * PAGE_LENGTH + 1;

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

  return (
    <div className="flex flex-col font-medium gap-5 flex-1">
      {showNavBar && (
        <>
          <div className="relative w-full h-8 flex flex-row">
            <span className="w-full text-center text-lg">
              {results.totalResults || 'No'} results <>{term && searchTerm()}</>
            </span>
            <PageResultsNav results={results} navigatePages={navigatePages} />
          </div>
          <div className="absolute -translate-y-1">
            <Dropdown
              {...orderDropdown.getProps()}
              options={orderByValues}
              label="Order"
            />
          </div>
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
