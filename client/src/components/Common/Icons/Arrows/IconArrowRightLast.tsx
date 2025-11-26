import { OptIconProps } from '../../../../types/common-props-types';
import SVG from '../../Custom/SVG';

const IconArrowRight = ({
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
      viewBox="0 0 24 24"
      width={width}
      height={height}
    >
      <path
        fill="currentColor"
        d="M13.9783 5.31877L10.7683 8.52877L8.79828 10.4888C7.96828 11.3188 7.96828 12.6688 8.79828 13.4988L13.9783 18.6788C14.6583 19.3588 15.8183 18.8688 15.8183 17.9188V12.3088V6.07877C15.8183 5.11877 14.6583 4.63877 13.9783 5.31877Z"
        transform="scale(-1 1) translate(-24 0)"
      />
    </SVG>
  </span>
);

export default IconArrowRight;

export const IconArrowRightLast = ({
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
      viewBox="0 0 25 24"
      width={width}
      height={height}
    >
      <path
        fill="currentColor"
        d="M13.9783 5.31877L10.7683 8.52877L8.79828 10.4888C7.96828 11.3188 7.96828 12.6688 8.79828 13.4988L13.9783 18.6788C14.6583 19.3588 15.8183 18.8688 15.8183 17.9188V12.3088V6.07877C15.8183 5.11877 14.6583 4.63877 13.9783 5.31877Z"
        transform="scale(-1 1) translate(-24 0)"
      />
      <rect x="18" y="4" width="1.5" height="16" fill="currentColor" rx="1" />
    </SVG>
  </span>
);
