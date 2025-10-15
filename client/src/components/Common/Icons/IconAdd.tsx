import { OptIconProps } from '../../../types/common-props-types';
import SVG from '../Custom/SVG';

const IconAdd = ({ width, height, url, newTab, ...rest }: OptIconProps) => (
  <span {...rest}>
    <SVG
      url={url}
      newTab={newTab}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="currentColor"
    >
      <rect x="0" fill="none" width="24" height="24" />

      <path d="M19 10.5h-5.5v-5.5h-3v5.5H5v3h5.5v5.5h3v-5.5H19z" />
    </SVG>
  </span>
);

export default IconAdd;
