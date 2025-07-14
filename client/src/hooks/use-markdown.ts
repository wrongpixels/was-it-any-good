import { useState, useEffect } from 'react';

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
      console.log(maxIndex, newIndex, maxIndex);
      return newIndex;
    });
  const moveUp = (): void =>
    setIndex((prevIndex: number) => {
      const newIndex: number = prevIndex - 1 < 0 ? maxIndex : prevIndex - 1;
      console.log(maxIndex, newIndex, maxIndex);
      return newIndex;
    });

  useEffect(() => {
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
    return () => document.removeEventListener('keydown', keyDown);
  }, [maxIndex, onEnter, onEsc, onMove, onNormalKey]);
  return { activeIndex: index, setIndex };
};

export default useListNavigation;
