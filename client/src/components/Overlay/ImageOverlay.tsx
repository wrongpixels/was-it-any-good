import { useEffect, useState, useRef, useCallback } from 'react';
import { useOverlay } from '../../context/OverlayProvider';
import LazyImage, { ImageVariant } from '../common/LazyImage';
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

  // Hooks remain unchanged
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
      const animFrame = requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsVisible(true))
      );
      return () => {
        cancelAnimationFrame(animFrame);
        setIsVisible(false);
        hideTimerRef.current = window.setTimeout(
          () => setIsMounted(false),
          ANIM_DURATION
        );
      };
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [overlay.active, overlay.overlayType]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 backdrop-blur-xs z-99 transition-opacity duration-200 ease-in-out  cursor-pointer ${
        isVisible
          ? 'opacity-100 bg-cyan-950/80'
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
          <div className="relative flex-1 min-h-0 p-2 pb-0 flex items-center justify-center">
            <LazyImage
              key={overlay.image}
              variant={ImageVariant.overlay}
              src={overlay.image}
              className="max-h-full h-auto w-auto min-w-[400px] min-h-[600px] object-contain rounded-md bg-gray-200 ring-1 ring-gray-350"
            />
          </div>

          <div className="flex-shrink-0 text-xs flex flex-row text-gray-500 font-semibold px-4 py-2 items-center justify-end gap-2">
            <span>Image Source:</span>
            <TMDBLogoHor
              height={10}
              url={TMDB_URL}
              newTab
              title="Open TMDB in a new tab"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageOverlay;
