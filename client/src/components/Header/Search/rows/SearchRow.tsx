import { JSX, useEffect } from 'react';
import { MediaType } from '../../../../../../shared/types/media';
import { IndexMediaData } from '../../../../../../shared/types/models';
import useHoverChecker from '../../../../hooks/use-hover-checker';
import SelectedLine from '../../../common/SelectedLine';
import FilmIcon from '../icons/FilmIcon';
import ShowIcon from '../icons/ShowIcon';
import { Link } from 'react-router-dom';

interface SearchRowProps {
  indexMedia: IndexMediaData;
  isSelected: boolean;
  onHover: (isHovering: boolean) => void;
}

const buildUrl = (im: IndexMediaData): string =>

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
      className={`flex flex-row gap-2 items-center px-1.5 py-0.5 relative font-medium rounded-lg ${isActive ? 'bg-amber-50 text-cyan-900' : ''}`}
    >
      <Link to="" >
      <SelectedLine active={isSelected} />
      {getIconByType(indexMedia.mediaType)}
      <div>
        {indexMedia.name}
        <span className="font-light pl-1">({indexMedia.year})</span>
      </div></Link>
    </div>
  );
};

const getIconByType = (mediaType: MediaType): JSX.Element | null => {
  switch (mediaType) {
    case MediaType.Film:
      return <FilmIcon />;
    case MediaType.Show:
      return <ShowIcon />;
    default:
      return null;
  }
};
export default SearchRow;
