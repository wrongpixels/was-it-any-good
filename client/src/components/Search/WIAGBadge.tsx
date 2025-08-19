import { JSX } from 'react';
import { styles } from '../../constants/tailwind-styles';
import CheckIcon from '../common/icons/CheckIcon';

const WIAGBadge = (): JSX.Element | null => {
  return (
    <span
      className={`absolute ml-0.5 mt-0.5 left-0 top-0 w-6 h-6 rounded-full ring-1 justify-center border-1 border-green-400 items-center flex shadow/100 text-green-100 bg-gradient-to-tl ring-green-600 from-green-600 to-green-400 ${styles.shadow.allShadow()} ${styles.animations.zoomOnHover}`}
    >
      <CheckIcon width={17} />
    </span>
  );
};

export default WIAGBadge;
