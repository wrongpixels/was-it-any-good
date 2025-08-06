interface OptIconProps {
  width?: number | string;
  height?: number | string;
  [key: string]: any;
}

const CheckIcon = ({ width, height, ...rest }: OptIconProps) => (
  <span {...rest}>
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
      <path d="M4 13L7.5 17L11 13L14.5 17L18.7085 8" />
    </svg>
  </span>
);

export default CheckIcon;
