import { JSX } from 'react';
import {
  IndexMediaResults,
  RatingResults,
} from '../../../../../shared/types/models';
import Button from '../../Common/Custom/Button';
import { OptClassNameProps } from '../../../types/common-props-types';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import React from 'react';
import { styles } from '../../../constants/tailwind-styles';
import IconArrowLeft from '../../Common/Icons/Arrows/IconArrowLeft';
import IconArrowRight from '../../Common/Icons/Arrows/IconArrowRight';
import DisabledDiv from '../../Common/Custom/DisabledDiv';

//how many page buttons we want to see on each side of current page (First and last not included)
const MAX_BUTTONS_PER_SIDE: number = 1;

interface PageResultsNavProps extends OptClassNameProps {
  results: IndexMediaResults | RatingResults;
  navigatePages: (page: number) => void;
}

const PageResultsNav = ({
  results,
  navigatePages,
  ...rest
}: PageResultsNavProps): JSX.Element | null => {
  const maxPage: number = results.totalPages;
  if (maxPage <= 1) {
    // return null;
  }
  const curPage: number = results.page;
  const singlePage: boolean = maxPage <= 1;
  const currentIsFirstOrLast: boolean = [1, maxPage].includes(curPage);

  //our shortcut to build buttons with only a parameter
  const buildButton = (
    page: number,
    isCurrent?: boolean
  ): JSX.Element | null => {
    if (!isCurrent && singlePage) {
      return null;
    }
    //if we're drawing current page button but it's either page 1 or max, we skip it.
    if (!singlePage && isCurrent && currentIsFirstOrLast) {
      return null;
    }

    return (
      <PageResultsNavButton
        key={page}
        page={page}
        curPage={curPage}
        navigatePages={navigatePages}
        singlePage={singlePage}
      />
    );
  };

  //the first Page Button
  const firstButton: JSX.Element | null = buildButton(1);

  //the current Page Button
  const curButton: JSX.Element | null = buildButton(curPage, true);

  //the last Page Button
  const lastButton: JSX.Element | null = buildButton(maxPage);

  //the padding buttons

  //the last Previous Page we should be able to see, 2 being the min, as page 1 is always present.
  let firstVisiblePage: number = Math.max(2, curPage - MAX_BUTTONS_PER_SIDE);
  //the last Next Page we should be able to see, maxPage-1 being the max
  let lastVisiblePage: number = Math.max(
    curPage,
    Math.min(curPage + MAX_BUTTONS_PER_SIDE, maxPage - 1)
  );
  /*
  //the moves we need to reach both page 2 and maxPage
  const maxPrevMoves: number = Math.max(curPage - 2, 0);
  const maxNextMoves: number = Math.max(maxPage - 1 - curPage, 0); */

  //the moves we can do from the current page to first and last visible pages
  let maxVisiblePrevMoves: number = Math.max(curPage - firstVisiblePage, 0);
  let maxVisibleNextMoves: number = lastVisiblePage - curPage;

  if (!singlePage && curPage === 1 && maxPage > lastVisiblePage + 1) {
    maxVisibleNextMoves += 1;
    lastVisiblePage += 1;
  }
  if (!singlePage && curPage === maxPage && firstVisiblePage - 1 > 1) {
    firstVisiblePage -= 1;
    maxVisiblePrevMoves += 1;
  }
  //we build the Previous Buttons
  const prevButtons: (JSX.Element | null)[] = [];
  for (let i = curPage - maxVisiblePrevMoves; i < curPage; i++) {
    prevButtons.push(buildButton(i));
  }

  //and the next Page Buttons
  const nextButtons: (JSX.Element | null)[] = [];
  for (let i = curPage + 1; i <= curPage + maxVisibleNextMoves; i++) {
    nextButtons.push(buildButton(i));
  }

  //to know if we need to draw padding buttons or not
  const drawLeftPadding: boolean = firstVisiblePage > 2;
  const drawRightPadding: boolean = lastVisiblePage < maxPage - 1;

  return (
    <span
      className={`${mergeClassnames('absolute right-0 -top-0.5 flex flex-row items-center gap-2', rest.className)} text-sm md:text-base`}
    >
      {/*
        <span className="">{`Page ${results.page} of ${results.totalPages || 1}`}</span>
      */}
      {<span className="mr-0.5">{`Page ${results.page}`}</span>}

      <DisabledDiv className="flex flex-row gap-0.25" disabled={singlePage}>
        <DisabledDiv
          className="flex flex-row"
          disabled={!singlePage && curPage === 1}
        >
          <Button
            className={`w-8 h-9 ${curPage > 1 && styles.animations.buttonLeft} p-0`}
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
        {firstButton}
        {drawLeftPadding && <PaddingButton />}
        {prevButtons}
        {curButton}
        {nextButtons}
        {drawRightPadding && <PaddingButton />}
        {lastButton}
        <DisabledDiv
          className="flex flex-row"
          disabled={!singlePage && results.page >= results.totalPages}
        >
          <Button
            className={`w-8 h-9 ${styles.animations.buttonRight} p-0`}
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
      </DisabledDiv>
    </span>
  );
};
interface PageResultsNavButtonProps {
  page: number;
  curPage: number;
  navigatePages: (page: number) => void;
  singlePage: boolean;
}

const PaddingButton = () => (
  <DisabledDiv disabled={true}>
    <Button className="w-6 text-xs h-9 flex items-center justify-center p-0 bg-gray-200 text-black">
      <span className="text-center">{'…'}</span>
    </Button>
  </DisabledDiv>
);

const PageResultsNavButton = ({
  page,
  curPage,
  navigatePages,
  singlePage,
}: PageResultsNavButtonProps): JSX.Element => {
  const isCurPage: boolean = page === curPage;
  return (
    <Button
      className={`w-6 h-9 p-0 ${!isCurPage || singlePage ? 'bg-gray-200 text-gray-600 font-normal hover:ring hover:ring-amber-200 hover:bg-gray-300/50' : 'font-semibold'}`}
      onClick={() => navigatePages(page - curPage)}
    >
      <span className="text-center w-full text-sm">{page}</span>
    </Button>
  );
};
export default React.memo(PageResultsNav);
