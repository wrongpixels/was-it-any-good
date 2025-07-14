import { JSX, useEffect } from 'react';
import useHoverChecker from '../../../../hooks/use-hover-checker';
import SelectedLine from '../../../common/SelectedLine';
import SearchIcon from '../icons/SearchIcon';

interface FirstSearchRowProps {
  searchValue: string;
  isSelected: boolean;
  onHover: (isHovering: boolean) => void;
}

const FirstSearchRow = ({
  searchValue,
  isSelected,
  onHover,
}: FirstSearchRowProps): JSX.Element => {
  const [ref, isHovered] = useHoverChecker();

  useEffect(() => {
    onHover(isHovered);
  }, [isHovered, onHover]);

  const isActive = isSelected || isHovered;

  return (
    <div
      ref={ref}
      key="last-search"
      className={`flex flex-row min-w-50 items-center font-medium relative px-1.5 py-0.5 rounded-lg ${isActive ? 'bg-blue-50 text-cyan-850' : ''}`}
    >
      <SelectedLine active={isSelected} />
      <span className="ml-1">
        <SearchIcon />
      </span>
      <div>
        <span className="font-light pl-1">
          Search for "<span className="font-semibold">{searchValue}</span>"
        </span>
      </div>
    </div>
  );
};
export default FirstSearchRow;
