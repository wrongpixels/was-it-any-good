import { JSX } from 'react';
import { styles } from '../../constants/tailwind-styles';
import CheckIcon from '../common/icons/CheckIcon';

const WIAGBadge = (): JSX.Element | null => {
  return (
    <span
      className={`absolute -ml-0.25 -mt-0.25 left-0 top-0 w-8 h-8 rounded-br-xl border-1 ring-1 rounded-tl-sm justify-center items-center flex shadow/100 text-white bg-gradient-to-t from-green-700 to-green-500 ${styles.shadow.allShadow()}`}
    >
      <CheckIcon width={24} />
    </span>
  );
};

export default WIAGBadge;
