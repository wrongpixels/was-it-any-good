import { JSX } from 'react';
import { IndexMediaResponse } from '../../../../../shared/types/models';
import { styles } from '../../../constants/tailwind-styles';
import Button from '../../Common/Custom/Button';
import DisabledDiv from '../../Common/Custom/DisabledDiv';
import { OptClassNameProps } from '../../../types/common-props-types';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import React from 'react';

interface PageResultsNavProps extends OptClassNameProps {
  results: IndexMediaResponse;
  navigatePages: (page: number) => void;
}

const PageResultsNav = ({
  results,
  navigatePages,
  ...rest
}: PageResultsNavProps): JSX.Element => {
  return (
    <span
      className={`${mergeClassnames('absolute right-0 flex flex-row items-center gap-2 h-full', rest.className)}`}
    >
      {`Page ${results.page} of ${results.totalPages || 1}`}
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

export default React.memo(PageResultsNav);
