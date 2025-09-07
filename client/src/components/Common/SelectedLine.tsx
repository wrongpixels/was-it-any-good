import { JSX } from 'react';
import { OptBoolProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface SelectedLineProps extends OptBoolProps {
  width?: number | string;
  height?: number | string;
  offsetX?: number;
}

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

  return (
    <span className="absolute inset-0 flex items-center pointer-events-none">
      <div
        {...props}
        className={mergeClassnames(
          'rounded-md bg-current text-starblue',
          `h-${height}`,
          className
        )}
        style={{
          width,
          transform: offsetX ? `translateX(${offsetX * 0.25}rem)` : 'none',
        }}
      />
    </span>
  );
};

export default SelectedLine;
