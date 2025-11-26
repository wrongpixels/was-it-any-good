import { JSX } from 'react';
import {
  IndexMediaResults,
  RatingResults,
} from '../../../../../shared/types/models';
import Button from '../../Common/Custom/Button';
import { OptClassNameProps } from '../../../types/common-props-types';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import React from 'react';

//how many page buttons we want to see apart from the current one
const MAX_ADDITIONAL_BUTTONS: number = 2;

interface PageResultsNavProps extends OptClassNameProps {
  results: IndexMediaResults | RatingResults;
  navigatePages: (page: number) => void;
}

const PageResultsNav = ({
  results,
  navigatePages,
  ...rest
}: PageResultsNavProps): JSX.Element => {
  const maxPage: number = results.totalPages;
  const curPage: number = results.page;

  //our shortcut to build buttons with only a parameter
  const buildButton = (
    page: number,
    isCurrent?: boolean
  ): JSX.Element | null => {
    //if we're drawing current page button but it's either page 1 or max, we skip it.
    if (isCurrent && [maxPage, 1].includes(page)) {
      return null;
    }

    return (
      <PageResultsNavButton
        key={page}
        page={page}
        curPage={curPage}
        navigatePages={navigatePages}
      />
    );
  };

  //the first Page Button
  const firstButton: JSX.Element | null = buildButton(1);

  //the current Page Button
  const curButton: JSX.Element | null = buildButton(curPage, true);

  //the last Page Button
  const lastButton: JSX.Element | null = buildButton(maxPage);

  //the last Previous Page we should be able to see, 2 being the min, as page 1 is always present.
  const firstVisiblePage: number = Math.max(
    2,
    curPage - MAX_ADDITIONAL_BUTTONS
  );
  //the last Next Page we should be able to see, maxPage being the max
  const lastVisiblePage: number = Math.min(
    curPage + MAX_ADDITIONAL_BUTTONS,
    maxPage
  );
  //the moves we need to reach both page 2 and maxPage
  const maxPrevMoves: number = curPage - 2;
  const maxNextMoves: number = maxPage - curPage;

  //the moves we can do from the current page to first and last visible pages
  let maxVisiblePrevMoves: number = curPage - firstVisiblePage;
  let maxVisibleNextMoves: number = lastVisiblePage - curPage;

  const usedVisibleMoves: number = maxVisibleNextMoves + maxVisiblePrevMoves;

  //if one side is bigger than the other, we try to give the free space to the other one
  if (usedVisibleMoves < MAX_ADDITIONAL_BUTTONS) {
    const availableMoves: number = MAX_ADDITIONAL_BUTTONS - usedVisibleMoves;
    if (maxVisiblePrevMoves < maxVisibleNextMoves) {
      maxVisiblePrevMoves = Math.min(
        maxVisiblePrevMoves + availableMoves,
        maxPrevMoves
      );
    } else {
      maxVisibleNextMoves = Math.min(
        maxVisibleNextMoves + availableMoves,
        maxNextMoves
      );
    }
  }

  //we build the Previous Buttons
  const prevButtons: (JSX.Element | null)[] = [];
  for (let i = curPage - maxVisiblePrevMoves; i < curPage; i++) {
    prevButtons.push(buildButton(i));
  }

  //and the next Page Buttons
  const nextButtons: (JSX.Element | null)[] = [];
  for (let i = curPage + 1; i < curPage + maxVisibleNextMoves; i++) {
    nextButtons.push(buildButton(i));
  }

  return (
    <span
      className={`${mergeClassnames('absolute right-0 -top-0.5 flex flex-row items-center gap-2', rest.className)} text-sm md:text-base`}
    >
      <span className="">{`Page ${results.page} of ${results.totalPages || 1}`}</span>
      <span className="flex flex-row gap-0.25">
        {firstButton}
        {prevButtons}
        {curButton}
        {nextButtons}
        {lastButton}
        {/* 
        <DisabledDiv className="flex flex-row" disabled={results.page === 1}>
          <Button
            className={`w-6 ${styles.animations.buttonLeft} p-0`}
            onClick={() => navigatePages(-1)}
          >
            <IconArrowLeftLast
              width={18}
              className={
                'flex items-center h-full w-full align-middle justify-center'
              }
            />
          </Button>
          <Button
            className={`w-7 ${styles.animations.buttonLeft} p-0`}
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
        <DisabledDiv
          className="flex flex-row"
          disabled={results.page >= results.totalPages}
        >
          <Button
            className={`w-7 ${styles.animations.buttonRight} p-0`}
            onClick={() => navigatePages(1)}
          >
            <IconArrowRight
              width={18}
              className={
                'flex items-center h-full w-full align-middle justify-center'
              }
            />
          </Button>
          <Button
            className={`w-6 ${styles.animations.buttonRight} p-0`}
            onClick={() => navigatePages(1)}
          >
            <IconArrowRightLast
              width={18}
              className={
                'flex items-center h-full w-full align-middle justify-center'
              }
            />
          </Button>
        </DisabledDiv>*/}
      </span>
    </span>
  );
};
interface PageResultsNavButton {
  page: number;
  curPage: number;
  navigatePages: (page: number) => void;
}

const PageResultsNavButton = ({
  page,
  curPage,
  navigatePages,
}: PageResultsNavButton): JSX.Element => {
  const isCurPage: boolean = page === curPage;
  return (
    <Button
      className={`w-6 h-9 p-0 ${!isCurPage ? 'bg-gray-200 text-gray-600 font-normal hover:ring hover:ring-amber-200 hover:bg-gray-300/50' : 'font-semibold'}`}
      onClick={() => navigatePages(page - curPage)}
    >
      <span className="text-center w-full text-sm">{page}</span>
    </Button>
  );
};
export default React.memo(PageResultsNav);
