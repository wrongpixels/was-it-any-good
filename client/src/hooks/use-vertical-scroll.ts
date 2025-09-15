import {
  useEffect,
  useRef,
  useState,
  RefObject,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';

export interface ScrollData {
  reference: RefObject<HTMLDivElement | null>;
  canScrollR: boolean;
  canScrollL: boolean;
  scrollLeft: () => void;
  scrollRight: () => void;
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
    Dispatch<SetStateAction<boolean>>,
  ] = useState(false);
  const [canScrollR, setCanScrollR]: [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] = useState(false);

  const updateScrollLimits = useCallback((): void => {
    const element: HTMLDivElement | null = reference.current;
    if (!element) {
      return;
    }

    const atStart: boolean = element.scrollLeft < 5;
    const atEnd: boolean =
      element.scrollLeft >= element.scrollWidth - element.clientWidth - 5;

    setCanScrollL(!atStart);
    setCanScrollR(!atEnd && element.scrollWidth > element.clientWidth);
  }, []);

  const animateScroll = useCallback((): void => {
    const element: HTMLDivElement | null = reference.current;
    if (!element || targetScrollLeft.current === null) {
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

    element.scrollLeft += distance * 0.2;
    animationFrameId.current = requestAnimationFrame(animateScroll);
  }, [updateScrollLimits]);

  const startAnimation = useCallback((): void => {
    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(animateScroll);
    }
  }, [animateScroll]);

  const scrollLeft = useCallback((): void => {
    const element: HTMLDivElement | null = reference.current;
    if (!element) {
      return;
    }
    targetScrollLeft.current = Math.max(0, element.scrollLeft - 200);
    startAnimation();
  }, [startAnimation]);

  const scrollRight = useCallback((): void => {
    const element: HTMLDivElement | null = reference.current;
    if (!element) {
      return;
    }
    const maxScroll: number = element.scrollWidth - element.clientWidth;
    targetScrollLeft.current = Math.min(maxScroll, element.scrollLeft + 200);
    startAnimation();
  }, [startAnimation]);

  useEffect(() => {
    const element: HTMLDivElement | null = reference.current;
    if (!element) {
      return;
    }

    element.style.scrollBehavior = 'auto';

    const checkSize = (): void => {
      updateScrollLimits();
    };
    checkSize();

    const onWheelEvent = (e: WheelEvent): void => {
      if (Math.abs(e.deltaY) === 0 || e.deltaX !== 0) {
        return;
      }

      const maxScroll: number = element.scrollWidth - element.clientWidth;
      if (maxScroll <= 0) {
        return;
      }

      const delta: number = e.deltaY * multiplier;

      //To allow vertical scrolling if we're at the start/end and there's nothing else to scroll horizontally
      //Discarded for now… more annoying that useful
      /*      const direction: boolean = delta > 0;
      const currentScroll: number = element.scrollLeft; if (
        (currentScroll <= 1 && !direction) ||
        (currentScroll >= maxScroll - 1 && direction)
      ) {
        return;
      }*/
      e.preventDefault();

      const currentTarget: number =
        targetScrollLeft.current ?? element.scrollLeft;
      targetScrollLeft.current = Math.max(
        0,
        Math.min(currentTarget + delta, maxScroll)
      );

      startAnimation();
    };

    const onScroll = (): void => {
      updateScrollLimits();
    };

    element.addEventListener('scroll', onScroll);
    element.addEventListener('wheel', onWheelEvent, { passive: false });

    const resizeObserver: ResizeObserver = new ResizeObserver(checkSize);
    resizeObserver.observe(element);

    return (): void => {
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('wheel', onWheelEvent);
      resizeObserver.unobserve(element);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [multiplier, updateScrollLimits, startAnimation]);

  return {
    reference,
    canScrollL,
    canScrollR,
    scrollLeft,
    scrollRight,
  };
};
