import { useEffect, useState, useRef, useCallback } from 'react';
import { useOverlay } from '../../context/OverlayProvider';
import LazyImage, { AspectRatio, ImageVariant } from '../common/LazyImage';
import TMDBLogoHor from '../common/icons/TMDB/TMDBLogoHor';
import { TMDB_URL } from '../../../../shared/constants/url-constants';
import useEventBlocker from '../../hooks/use-event-blocker';
import { OverlayType } from '../../types/overlay-types';

const ANIM_DURATION: number = 300;

const ImageOverlay = () => {
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
    if (overlay.active && overlay.overlayType === OverlayType.Image) {
      window.addEventListener('keydown', closeWithKey);
    }
    return () => {
      window.removeEventListener('keydown', closeWithKey);
    };
  }, [overlay.active, closeWithKey, overlay.overlayType]);

  useEffect(() => {
    if (overlay.active && overlay.overlayType === OverlayType.Image) {
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
    ${isVisible ? 'opacity-100 bg-cyan-950/80' : 'opacity-0 pointer-events-none'}`}
    >
      <span className="h-full w-full">
        <span
          className={`flex h-full w-full items-center justify-center cursor-pointer p-[10px]
        transition-transform duration-250 ease-in-out
        ${isVisible ? 'scale-100' : 'scale-85'}`}
          onClick={clean}
        >
          <span
            className={`flex flex-col bg-gray-100 border-gray-100 border-14 rounded-lg drop-shadow-xl/60 cursor-default
    pointer-events-auto transition-all duration-300
    w-auto max-w-[92vw] max-h-[calc(100vh-20px)]
    ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-20'}`}
          >
            {/* IMAGE AREA */}
            <div className="flex-1 min-h-0 p-2">
              {/* This is the bounded box that defines the available space for the poster */}
              <div className="relative h-full min-h-0 w-full flex items-center justify-center">
                {/* Use a plain img first to rule out LazyImage internals */}
                <img
                  src={overlay.image}
                  alt=""
                  // Key constraints:
                  // - Let the image size by its intrinsic ratio
                  // - But never exceed the box in either dimension
                  className="max-h-full max-w-full h-auto w-auto object-contain rounded-md bg-gray-200 ring-1 ring-gray-350"
                  draggable={false}
                />
              </div>
            </div>

            <span className="flex-shrink-0 min-h-[28px] text-xs flex flex-row text-gray-500 font-semibold px-3 py-2 items-center justify-end gap-2 border-t border-gray-200">
              Image Source:
              <TMDBLogoHor
                height={12}
                url={TMDB_URL}
                newTab
                title="Open TMDB in a new tab"
              />
            </span>
          </span>
        </span>
      </span>
    </div>
  );
};

export default ImageOverlay;
