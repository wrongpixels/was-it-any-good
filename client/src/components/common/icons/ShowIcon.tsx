import { OptIconProps } from '../../../types/common-props-types';

const ShowIcon = ({ width, height = 20, ...rest }: OptIconProps) => (
  <span {...rest}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={width}
      height={height}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 7h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h7zm0 0L8 3m4 4 4-4"
      />
    </svg>
  </span>
);
export default ShowIcon;
