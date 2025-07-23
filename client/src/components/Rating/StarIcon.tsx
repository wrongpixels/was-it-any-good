import { JSX } from 'react';
import { styles } from '../../constants/tailwind-styles';

interface StarIconProps {
  readonly width: number;
  readonly interactive?: boolean;
}
const StarIcon = ({ width, interactive }: StarIconProps): JSX.Element => (
  <svg
    width={width}
    height={width}
    viewBox="0 0 24 24"
    className={`fill-current max-w-${width} ${interactive ? styles.animations.zoomMoreOnHover : ''}`}
    style={{ maxWidth: `${width}px` }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8532 4.13112C11.2884 3.12751 12.7117 3.12752 13.1469 4.13112L15.1266 8.69665L20.0805 9.16869C21.1695 9.27246 21.6093 10.626 20.7893 11.3501L17.059 14.6438L18.1408 19.501C18.3787 20.5688 17.2272 21.4053 16.2853 20.8492L12 18.3193L7.71482 20.8492C6.77284 21.4053 5.62141 20.5688 5.85923 19.501L6.94111 14.6438L3.21082 11.3501C2.39082 10.626 2.83063 9.27246 3.91959 9.16869L8.87345 8.69665L10.8532 4.13112Z"
    />
  </svg>
);

export default StarIcon;
