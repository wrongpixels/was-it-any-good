import { useEffect, useRef, RefObject, useCallback } from "react";

export const useVerticalScroll = (
  multiplier: number = 1
): RefObject<HTMLDivElement | null> => {
  const reference: RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  const targetScrollLeft = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);

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
      return;
    }

    const newScrollLeft: number = currentScrollLeft + distance * 0.3;
    element.scrollLeft = newScrollLeft;

    animationFrameId.current = requestAnimationFrame(animateScroll);
  }, []);

  useEffect(() => {
    const element: HTMLDivElement | null = reference.current;
    if (!element) {
      return;
    }

    element.style.scrollBehavior = "auto";

    const onWheelEvent = (e: WheelEvent): void => {
      if (Math.abs(e.deltaY) === 0) {
        return;
      }

      const maxScroll: number = element.scrollWidth - element.clientWidth;
      if (maxScroll <= 0) {
        return;
      }
      e.preventDefault();

      const delta: number = e.deltaY * multiplier;
      const currentScroll: number = element.scrollLeft;
      let potentialNewTarget: number = currentScroll + delta;
      potentialNewTarget = Math.max(0, Math.min(potentialNewTarget, maxScroll));

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

    element.addEventListener("wheel", onWheelEvent, { passive: false });

    return () => {
      element.removeEventListener("wheel", onWheelEvent);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [multiplier, animateScroll]);

  return reference;
};
