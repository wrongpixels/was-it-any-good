import { useEffect, useState, useRef, useCallback } from 'react';
import { useOverlay } from '../../context/OverlayProvider';
import useEventBlocker from '../../hooks/use-event-blocker';
import { OverlayType } from '../../types/overlay-types';

const ANIM_DURATION: number = 300;

const SignUpOverlay = () => {
  const { overlay, clean } = useOverlay();
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  useEventBlocker(overlay.active, [
    'wheel',
    'touchmove',
    'keydown',
    'mousedown',
  ]);

  const closeWithKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        clean();
      }
      e.preventDefault();
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

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 backdrop-blur-xs z-99 transition-all duration-200 ease-in-out
        ${isVisible ? 'opacity-100 bg-gray-300' : 'opacity-0 pointer-events-none'}`}
    >
      <span
        className={`flex flex-col h-full items-center align-middle justify-center cursor-pointer
          transition-transform duration-250 ease-in-out
          ${isVisible ? 'scale-100' : 'scale-85'}`}
        onClick={clean}
      >
        <span
          className={`bg-gray-100 border-gray-100 border-14 rounded-lg drop-shadow-xl/60 cursor-default 
            pointer-events-auto transition-all duration-300
            ${isVisible ? 'opacity-100 scale-100  translate-y-0' : 'opacity-0 scale-75 translate-y-20'}`}
        ></span>
      </span>
    </div>
  );
};

export default SignUpOverlay;
