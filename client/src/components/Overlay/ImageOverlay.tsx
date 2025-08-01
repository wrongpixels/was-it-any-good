import { useEffect, useState, useRef, useCallback } from 'react';
import imageLinker from '../../../../shared/util/image-linker';
import { userOverlay } from '../../context/OverlayProvider';
import LazyImage, { ImageVariant } from '../common/LazyImage';
import TMDBLogoHor from '../common/icons/TMDB/TMDBLogoHor';
import { TMDB_URL } from '../../../../shared/constants/url-constants';
import useEventBlocker from '../../hooks/use-event-blocker';

const ANIM_DURATION: number = 300;

const ImageOverlay = () => {
  const { overlay, clean } = userOverlay();
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  useEventBlocker(overlay.active, ['wheel', 'touchmove', 'keydown']);

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
    if (overlay.active) {
      window.addEventListener('keydown', closeWithKey);
    }
    return () => {
      window.removeEventListener('keydown', closeWithKey);
    };
  }, [overlay.active, closeWithKey]);

  useEffect(() => {
    if (overlay.active) {
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
  }, [overlay.active]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 backdrop-blur-xs z-99 transition-all duration-200 ease-in-out
        ${isVisible ? 'opacity-100 bg-cyan-950/80' : 'opacity-0 pointer-events-none'}`}
    >
      <span
        className={`flex flex-col h-full items-center align-middle justify-center cursor-pointer
          transition-transform duration-250 ease-in-out
          ${isVisible ? 'scale-100' : 'scale-85'}`}
        onClick={clean}
      >
        <span
          className={`bg-gray-100 border-gray-100 border-14 rounded-lg drop-shadow-xl/60 cursor-default 
            pointer-events-auto w-auto transition-all duration-300
            ${isVisible ? 'opacity-100 scale-100  translate-y-0' : 'opacity-0 scale-75 translate-y-20'}`}
        >
          <LazyImage
            key={overlay.image}
            variant={ImageVariant.inline}
            src={imageLinker.getFullSizeImage(overlay.image)}
            className="rounded-md"
          />
          <span className="text-xs flex flex-row text-gray-500 font-semibold pl-3 items-center justify-baseline mt-3 gap-2 pointer-events-auto">
            <>{'Image Source:'}</>
            <TMDBLogoHor
              height={12}
              url={TMDB_URL}
              newTab={true}
              title={'Open TMDB in a new tab'}
            />
          </span>
        </span>
      </span>
    </div>
  );
};

export default ImageOverlay;
