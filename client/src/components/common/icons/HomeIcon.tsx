import { OptIconProps } from '../../../types/common-props-types';
import SVG from '../SVG';

/**
 * A simple, filled home icon with a smaller, more proportional door cutout.
 */
const HomeIcon = ({ width, height, url, newTab, ...rest }: OptIconProps) => (
  <span {...rest}>
    <SVG
      url={url}
      newTab={newTab}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 2 L2 12 H5 V21 H19 V12 H22 L12 2 Z M10 16 H14 V21 H10 V16 Z"
      />
    </SVG>
  </span>
);

export default HomeIcon;
