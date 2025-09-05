import { JSX } from 'react';
import { OptClassNameProps } from '../../../../types/common-props-types';
import { styles } from '../../../../constants/tailwind-styles';
import IconCrown from './IconCrown';

interface IndexBadgeProps extends OptClassNameProps {
  index: number;
}

const badgeBright: string = 'bg-gradient-to-br from-white/35 to-black/15';

const getColors = (index: number) => {
  switch (index) {
    case 1:
      return `bg-gold ${badgeBright} border-gold-bright ring-gray-500 text-white`;
    case 2:
      return `bg-gray-350 ${badgeBright} border-gray-325 ring-gray-500 text-white font-black`;
    case 3:
      return `bg-bronze ${badgeBright} border-amber-500 ring-gray-500 text-white font-bold`;
    default:
      return 'bg-starbright border-starbrighter ring-gray-500 text-white ';
  }
};

const IndexBadge = ({ index }: IndexBadgeProps): JSX.Element | null => {
  return (
    <span
      className={`absolute -ml-0.25 -mt-0.25 left-0 top-0 w-8 h-8 rounded-br-xl border-1 ring-1 rounded-tl-sm justify-center items-center flex shadow/100  ${getColors(index)} ${styles.shadow.allShadow()}`}
    >
      {index === 1 ? <IconCrown /> : index}
    </span>
  );
};

export default IndexBadge;
