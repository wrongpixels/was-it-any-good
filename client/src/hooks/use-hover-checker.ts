import { useState, useRef, useEffect } from 'react';

const useHoverChecker = (): [
  React.RefObject<HTMLDivElement | null>,
  boolean,
] => {
  const [hovered, setHovered] = useState(false);
  const ref: React.RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, hovered];
};

export default useHoverChecker;
