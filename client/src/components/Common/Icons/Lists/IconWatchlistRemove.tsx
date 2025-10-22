import { OptIconProps } from '../../../../types/common-props-types';
import SVG from '../../Custom/SVG';

const IconWatchlistRemove = ({
  width = 20,
  height,
  url,
  newTab,
  ...rest
}: OptIconProps) => (
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
        d="M7 1C5.34315 1 4 2.34315 4 4V20.9425C4 22.6114 5.92338 23.5462 7.23564 22.5152L12 18.7717L16.7644 22.5152C18.0766 23.5462 20 22.6114 20 20.9425V4C20 2.34315 18.6569 1 17 1H7Z"
      />
    </SVG>
  </span>
);

export default IconWatchlistRemove;
