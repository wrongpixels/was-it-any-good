import { JSX } from 'react';
import { IndexMediaResponse } from '../../../../shared/types/models';
import { styles } from '../../constants/tailwind-styles';
import Button from '../common/Button';
import DisabledDiv from '../common/DisabledDiv';

interface PageResultsNavProps {
  results: IndexMediaResponse;
  navigatePages: (page: number) => void;
}

const PageResultsNav = ({
  results,
  navigatePages,
}: PageResultsNavProps): JSX.Element => {
  return (
    <span className="absolute right-0 top-0 flex flex-row items-center gap-2 h-full">
      {`Page ${results.page} of ${results.totalPages}`}
      <span className="flex flex-row gap-1">
        <DisabledDiv disabled={results.page === 1}>
          <Button
            className={`w-8 ${styles.animations.buttonLeft}`}
            onClick={() => navigatePages(-1)}
          >
            ⏴
          </Button>
        </DisabledDiv>
        <DisabledDiv disabled={results.page >= results.totalPages}>
          <Button
            className={`w-8 ${styles.animations.buttonRight}`}
            onClick={() => navigatePages(1)}
          >
            ⏵
          </Button>
        </DisabledDiv>
      </span>
    </span>
  );
};

export default PageResultsNav;
