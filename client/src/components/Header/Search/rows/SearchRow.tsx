import { JSX, useEffect } from 'react';
import { IndexMediaData } from '../../../../../../shared/types/models';
import useHoverChecker from '../../../../hooks/use-hover-checker';
import SelectedLine from '../../../common/SelectedLine';
import IconForMediaType from '../icons/IconForMediaType';

interface SearchRowProps {
  indexMedia: IndexMediaData;
  isSelected: boolean;
  onHover: (isHovering: boolean) => void;
}

const SearchRow = ({
  indexMedia,
  isSelected,
  onHover,
}: SearchRowProps): JSX.Element => {
  const [ref, isHovered] = useHoverChecker();

  useEffect(() => {
    onHover(isHovered);
  }, [isHovered, onHover]);

  const isActive = isSelected || isHovered;

  return (
    <div
      ref={ref}
      className={`flex flex-row gap-2 items-center px-1.5 py-0.5  relative font-medium rounded-lg ${
        isActive ? 'bg-amber-50 text-cyan-900' : 'text-gray-500'
      }`}
    >
      <SelectedLine condition={isSelected} offsetX={-0.3} height={4} />
      <IconForMediaType mediaType={indexMedia.mediaType} />
      <div>
        {indexMedia.name}
        <span className="font-light pl-1">({indexMedia.year})</span>
      </div>
    </div>
  );
};
export default SearchRow;
