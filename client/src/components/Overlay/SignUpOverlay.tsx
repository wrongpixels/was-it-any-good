import { useEffect, useState, useRef, useCallback, JSX } from 'react';
import { useOverlay } from '../../context/OverlayProvider';
import useEventBlocker from '../../hooks/use-event-blocker';
import { OverlayType } from '../../types/overlay-types';
import SignUpForm from './SignUpForm';

const ANIM_DURATION: number = 300;

const SignUpOverlay = (): JSX.Element | null => {
  const { overlay, clean } = useOverlay();

  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);
  //we block events

  useEventBlocker(
    overlay.active && overlay.overlayType === OverlayType.SignUp,
    ['wheel', 'touchmove'],
    backRef.current
  );
  const closeWithKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        clean();
      }
    },
    [clean]
  );

  useEffect(() => {
    if (overlay.active && overlay.overlayType === OverlayType.SignUp) {
      window.addEventListener('keydown', closeWithKey);
    }
    return () => {
      window.removeEventListener('keydown', closeWithKey);
    };
  }, [overlay.active, closeWithKey, overlay.overlayType]);

  useEffect(() => {
    if (overlay.active && overlay.overlayType === OverlayType.SignUp) {
      setIsMounted(true);
      const animationFrame = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setIsVisible(true);
        })
      );

      return () => {
        cancelAnimationFrame(animationFrame);
        setIsVisible(false);
        hideTimerRef.current = window.setTimeout(() => {
          setIsMounted(false);
        }, ANIM_DURATION);
      };
    }
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [overlay.active, overlay.overlayType]);

  if (!isMounted || overlay.overlayType !== OverlayType.SignUp) {
    return null;
  }

  return (
    <div
      ref={backRef}
      className={`fixed inset-0 backdrop-blur-xs z-99 transition-opacity duration-200 ease-in-out  cursor-pointer ${
        isVisible
          ? 'opacity-100 bg-gray-400/80'
          : 'opacity-0 pointer-events-none'
      }`}
      onClick={clean}
    >
      <div
        className={`flex h-full w-full items-center justify-center p-4 transition-transform duration-250 ease-in-out ${
          isVisible ? 'scale-100' : 'scale-85'
        }`}
      >
        <div
          className={`grid bg-gray-100 rounded-lg shadow-xl cursor-default
              pointer-events-auto transition-all duration-300
              max-h-[calc(100vh-32px)] w-fit max-w-[95vw]
              grid-rows-[1fr_auto]
              overflow-hidden
              ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-20'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpOverlay;
