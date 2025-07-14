import { useState, useEffect, useRef } from 'react';

interface ListNavProps {
  maxIndex: number;
  onEnter?: () => void;
  onEsc?: () => void;
  onMove?: () => void;
  onNormalKey?: () => void;
}
interface ListNavValues {
  activeIndex: number;
  setIndex: (value: React.SetStateAction<number>) => void;
  ref: React.RefObject<HTMLDivElement | null>;
}

const useListNavigation = ({
  maxIndex,
  onEnter,
  onMove,
  onNormalKey,
  onEsc,
}: ListNavProps): ListNavValues => {
  const [index, setIndex] = useState(0);

  const moveDown = (): void =>
    setIndex((prevIndex) => {
      const newIndex: number = prevIndex + 1 > maxIndex ? 0 : prevIndex + 1;
      return newIndex;
    });
  const moveUp = (): void =>
    setIndex((prevIndex: number) => {
      const newIndex: number = prevIndex - 1 < 0 ? maxIndex : prevIndex - 1;
      return newIndex;
    });
  const ref: React.RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (e.target instanceof Node && !ref.current?.contains(e.target)) {
        onEsc?.();
      }
    };
    const keyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          moveUp();
          onMove?.();
          e.preventDefault();
          break;
        case 'ArrowDown':
          moveDown();
          onMove?.();
          e.preventDefault();
          break;
        case 'Escape':
          onEsc?.();
          e.preventDefault();
          break;
        case 'Enter':
          onEnter?.();
          e.preventDefault();
          break;
        default:
          onNormalKey?.();
      }
    };
    document.addEventListener('keydown', keyDown);
    document.addEventListener('mousedown', clickOutside);
    return () => {
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('mousedown', clickOutside);
    };
  }, [maxIndex, onEnter, onEsc, onMove, onNormalKey]);
  return { activeIndex: index, setIndex, ref };
};

export default useListNavigation;
