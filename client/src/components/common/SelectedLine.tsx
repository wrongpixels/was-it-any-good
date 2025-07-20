import { JSX } from 'react';
import { OptBoolProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface SelectedLineProps extends OptBoolProps {
  width?: number | string;
  height?: number | string;
  offsetX?: number;
}

const translateTo = (value: number) =>
  `${value >= 0 ? '' : '-'}ml-${Math.abs(value)}`;

const SelectedLine = ({
  condition = true,
  className,
  width = 3,
  height = 'full',
  offsetX,
  ...props
}: SelectedLineProps): JSX.Element | null => {
  if (!condition) {
    return null;
  }
  const realHeight: string = `h-${height}`;
  const realOffset: string = offsetX ? translateTo(offsetX) : '';
  console.log(realOffset);

  return (
    <span className="absolute inset-0 flex items-center pointer-events-none">
      <div
        {...props}
        className={mergeClassnames(
          `rounded-md bg-current text-starblue`,
          `${className} ${realOffset} ${realHeight}`
        )}
        style={{ width: width }}
      />
    </span>
  );
};

export default SelectedLine;
