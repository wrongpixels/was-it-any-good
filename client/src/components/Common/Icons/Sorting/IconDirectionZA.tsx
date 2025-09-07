import { OptIconProps } from '../../../../types/common-props-types';
import SVG from '../../Custom/SVG';

const IconDirectionZA = ({
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
      viewBox="0 0 30 76"
      width={width}
      height={height}
      fill="currentColor"
    >
      <text
        x="50%"
        y="45%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="32"
        fontWeight="semibold"
        fill="currentColor"
      >
        Z
      </text>
      <text
        x="50%"
        y="80%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="32"
        fontWeight="semibold"
        fill="currentColor"
        opacity="65%"
      >
        A
      </text>
    </SVG>
  </span>
);

export default IconDirectionZA;
