import { OptIconProps } from '../../../types/common-props-types';
import SVG from '../Custom/SVG';

const IconAlert = ({
  width,
  height = 20,
  url,
  newTab,
  ...rest
}: OptIconProps) => (
  <span {...rest}>
    <SVG
      url={url}
      newTab={newTab}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={width}
      height={height}
    >
      <path
        d="M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165Zm0-105a10,10,0,0,0-10,10v47.5a10,10,0,0,0,20,0V70A10,10,0,0,0,100,60Z"
        fill="currentColor"
      />
      <circle cx="100" cy="140" r="10" fill="currentColor" />
    </SVG>
  </span>
);

export default IconAlert;
