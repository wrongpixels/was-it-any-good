import { OptIconProps } from '../../../types/common-props-types';
import SVG from '../SVG';

const IconCreate = ({ width, height, url, newTab, ...rest }: OptIconProps) => (
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
      <g>
        <path d="M21 14v5c0 1.105-.895 2-2 2H5c-1.105 0-2-.895-2-2V5c0-1.105.895-2 2-2h5v2H5v14h14v-5h2z" />
        <path d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4" />
      </g>
    </SVG>
  </span>
);

export default IconCreate;
