import { JSX } from 'react';
import { OptClassNameProps } from '../../../types/common-props-types';
import CrownIcon from '../../Header/Search/icons/Crown';

interface IndexBadgeProps extends OptClassNameProps {
  index: number;
}

const getColors = (index: number) => {
  switch (index) {
    case 1:
      return 'bg-gold border-gold-bright ring-gray-500 text-white';
    case 2:
      return 'bg-gray-350 border-gray-325 ring-gray-500 text-white font-black';
    case 3:
      return 'bg-bronze border-amber-500 ring-gray-500 text-white font-bold';
    default:
      return 'bg-starbright border-starbrighter ring-gray-500 text-white';
  }
};

const IndexBadge = ({ index }: IndexBadgeProps): JSX.Element | null => {
  return (
    <span
      className={`absolute -ml-0.25 -mt-0.25 left-0 top-0 w-8 h-8 rounded-br-xl border-1 ring-1 rounded-tl-sm justify-center items-center flex drop-shadow-sm  ${getColors(index)}`}
    >
      {index === 1 ? <CrownIcon /> : index}
    </span>
  );
};

export default IndexBadge;
