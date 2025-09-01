import { OptIconProps } from '../../../../types/common-props-types';
import SVG from '../../SVG';

const IconInvertSortDir = ({
  width,
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
      viewBox="0 0 256 256"
      width={width}
      height={height}
      fill="currentColor"
    >
      <rect x="0" fill="none" width="256" height="256" />
      <path d="M119.39062,172.93848a8.00028,8.00028,0,0,1-1.73339,8.71875l-32,32a8.00181,8.00181,0,0,1-11.31446,0l-32-32A8.00065,8.00065,0,0,1,48,168H72V48a8,8,0,0,1,16,0V168h24A8,8,0,0,1,119.39062,172.93848Zm94.26661-98.59571-32-32a8.00122,8.00122,0,0,0-11.31446,0l-32,32A8.00065,8.00065,0,0,0,144,88h24V208a8,8,0,0,0,16,0V88h24a8.00066,8.00066,0,0,0,5.65723-13.65723Z" />
    </SVG>
  </span>
);

export default IconInvertSortDir;
