import { JSX } from 'react';
import {
  IndexMediaResults,
  RatingResults,
} from '../../../../../shared/types/models';
import { styles } from '../../../constants/tailwind-styles';
import Button from '../../Common/Custom/Button';
import DisabledDiv from '../../Common/Custom/DisabledDiv';
import { OptClassNameProps } from '../../../types/common-props-types';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import React from 'react';
import IconArrowLeft from '../../Common/Icons/Arrows/IconArrowLeft';
import IconArrowRight from '../../Common/Icons/Arrows/IconArrowRight';

interface PageResultsNavProps extends OptClassNameProps {
  results: IndexMediaResults | RatingResults;
  navigatePages: (page: number) => void;
}

const PageResultsNav = ({
  results,
  navigatePages,
  ...rest
}: PageResultsNavProps): JSX.Element => {
  return (
    <span
      className={`${mergeClassnames('absolute right-0 flex flex-row items-center gap-2 h-full', rest.className)} text-sm md:text-base`}
    >
      <span className="">{`Page ${results.page} of ${results.totalPages || 1}`}</span>

      <span className="flex flex-row gap-1">
        <DisabledDiv disabled={results.page === 1}>
          <Button
            className={`w-8 ${styles.animations.buttonLeft} p-0`}
            onClick={() => navigatePages(-1)}
          >
            <IconArrowLeft
              width={18}
              className={
                'flex items-center h-full w-full align-middle justify-center'
              }
            />
          </Button>
        </DisabledDiv>
        <DisabledDiv disabled={results.page >= results.totalPages}>
          <Button
            className={`w-8 ${styles.animations.buttonRight} p-0`}
            onClick={() => navigatePages(1)}
          >
            <IconArrowRight
              width={18}
              className={
                'flex items-center h-full w-full align-middle justify-center'
              }
            />
          </Button>
        </DisabledDiv>
      </span>
    </span>
  );
};

export default React.memo(PageResultsNav);
