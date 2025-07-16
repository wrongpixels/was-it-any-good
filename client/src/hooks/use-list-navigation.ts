import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ListNavProps {
  maxIndex: number;
  onNavigate?: () => void;
  onEnter?: () => void;
  onEsc?: () => void;
  onMove?: () => void;
  onNormalKey?: () => void;
  onClick?: () => void;
  onClickOut?: () => void;
}
interface ListNavValues {
  activeIndex: number;
  hoveredIndex: number | null;
  setIndex: (value: React.SetStateAction<number>) => void;
  setHoveredIndex: (value: React.SetStateAction<number | null>) => void;
  navigateTo: (url: string) => void;
  ref: React.RefObject<HTMLDivElement | null>;
}

const useListNavigation = ({
  maxIndex,
  onNavigate,
  onEnter,
  onMove,
  onNormalKey,
  onEsc,
  onClick,
  onClickOut,
}: ListNavProps): ListNavValues => {
  const [index, setIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const navigateTo = (url: string) => {
    navigate(url);
    onNavigate?.();
  };

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
        onClickOut?.();
      } else {
        onClick?.();
      }
    };
    const keyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          moveUp();
          onMove?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          onMove?.();
          break;
        case 'Escape':
          e.preventDefault();
          onEsc?.();
          break;
        case 'Enter':
          e.preventDefault();
          onEnter?.();
          document.activeElement instanceof HTMLElement &&
            document.activeElement.blur();
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
  return {
    activeIndex: index,
    setIndex,
    hoveredIndex,
    setHoveredIndex,
    navigateTo,
    ref,
  };
};

export default useListNavigation;
