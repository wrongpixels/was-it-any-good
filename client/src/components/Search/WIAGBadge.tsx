import { JSX } from 'react';
import { styles } from '../../constants/tailwind-styles';
import CheckIcon from '../common/icons/badges/IconCheck';

const WIAGBadge = (): JSX.Element | null => {
  return (
    <span
      className={`absolute ml-0.5 mt-0.5 left-0 top-0 w-6 h-6 rounded-full ring-1 justify-center border-1 border-starbrighter items-center flex shadow/100 text-white bg-gradient-to-tl ring-stardarker from-starblue to-starbrightest ${styles.shadow.allShadow()} ${styles.animations.zoomOnHover} cursor-help`}
    >
      <CheckIcon width={17} />
    </span>
  );
};

export default WIAGBadge;
