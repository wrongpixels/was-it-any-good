import { useEffect, useRef, useState, RefObject, useCallback } from 'react';

export interface ScrollData {
  reference: RefObject<HTMLDivElement | null>;
  canScrollR: boolean;
  canScrollL: boolean;
}

//We read vertical mousewheel, convert it into custom smooth horizontal scroll, and set 'canScroll' to draw a fade if necessary
export const useVerticalScroll = (multiplier: number = 1): ScrollData => {
  const reference: RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  const targetScrollLeft: RefObject<number | null> = useRef<number | null>(
    null
  );
  const animationFrameId: RefObject<number | null> = useRef<number | null>(
    null
  );

  const [canScrollL, setCanScrollL]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState(false);

  const [canScrollR, setCanScrollR]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState(false);

  const updateScrollLimits = useCallback((): void => {
    const element: HTMLDivElement | null = reference.current;
    if (!element) {
      setCanScrollL(false);
      setCanScrollR(false);
      return;
    }
    setCanScrollL(element.scrollLeft > 10);
    setCanScrollR(
      element.scrollLeft + 10 < element.scrollWidth - element.clientWidth
    );
  }, []);

  const animateScroll = useCallback((): void => {
    const element: HTMLDivElement | null = reference.current;
    if (
      !element ||
      targetScrollLeft.current === null ||
      element.scrollWidth <= element.clientWidth
    ) {
      animationFrameId.current = null;
      return;
    }

    const currentScrollLeft: number = element.scrollLeft;
    const distance: number = targetScrollLeft.current - currentScrollLeft;

    if (Math.abs(distance) < 1) {
      element.scrollLeft = targetScrollLeft.current;
      targetScrollLeft.current = null;
      animationFrameId.current = null;
      updateScrollLimits();
      return;
    }

    const newScrollLeft: number = currentScrollLeft + distance * 0.3;
    element.scrollLeft = newScrollLeft;

    animationFrameId.current = requestAnimationFrame(animateScroll);
  }, [updateScrollLimits]);

  useEffect(() => {
    const element: HTMLDivElement | null = reference.current;
    if (!element) {
      return;
    }

    element.style.scrollBehavior = 'auto';
    updateScrollLimits();

    const onWheelEvent = (e: WheelEvent): void => {
      if (Math.abs(e.deltaY) === 0) {
        return;
      }

      const maxScroll: number = element.scrollWidth - element.clientWidth;
      if (maxScroll <= 0) {
        return;
      }

      const delta: number = e.deltaY * multiplier;
      const direction: boolean = delta > 0;
      const currentScroll: number = element.scrollLeft;
      let potentialNewTarget: number = currentScroll + delta;
      potentialNewTarget = Math.max(0, Math.min(potentialNewTarget, maxScroll));
      //To allow vertical scrolling if we're at the start/end and there's nothing else to scroll horizontally
      //Discarded for now… more annoying that useful
      /* if (
        (currentScroll <= 1 && !direction) ||
        (currentScroll >= maxScroll - 1 && direction)
      ) {
        return;
      }*/
      e.preventDefault();
      if (
        targetScrollLeft.current === null ||
        Math.abs(targetScrollLeft.current - potentialNewTarget) > 5
      ) {
        targetScrollLeft.current = potentialNewTarget;
      } else {
        targetScrollLeft.current += delta;
        targetScrollLeft.current = Math.max(
          0,
          Math.min(targetScrollLeft.current, maxScroll)
        );
      }

      if (animationFrameId.current === null) {
        animationFrameId.current = requestAnimationFrame(animateScroll);
      }
    };

    const onScroll = (): void => {
      updateScrollLimits();
    };

    element.addEventListener('wheel', onWheelEvent, { passive: false });
    element.addEventListener('scroll', onScroll);

    return (): void => {
      element.removeEventListener('wheel', onWheelEvent);
      element.removeEventListener('scroll', onScroll);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [multiplier, animateScroll, updateScrollLimits]);

  return {
    reference,
    canScrollL,
    canScrollR,
  };
};
