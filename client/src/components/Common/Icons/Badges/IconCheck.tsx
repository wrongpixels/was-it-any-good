import { OptIconProps } from '../../../../types/common-props-types';

const IconCheck = ({
  width = 24,
  height = 24,
  title = 'Added to WIAG database',
  ...rest
}: OptIconProps) => (
  <span title={title} {...rest}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M6 13l3.5 3.5L18 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export default IconCheck;
