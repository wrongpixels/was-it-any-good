import { JSX } from 'react';
import { OptBoolProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface SelectedLineProps extends OptBoolProps {
  width?: number | string;
  height?: number | string;
}

const SelectedLine = ({
  condition,
  className,
  width = 3,
  height = 'full',
  ...props
}: SelectedLineProps): JSX.Element | null => {
  if (!condition) {
    return null;
  }
  const realHeight = `h-${height}`;
  return (
    <div className="absolute inset-0 flex items-center">
      <div
        {...props}
        className={mergeClassnames(
          `rounded-md bg-current text-starblue ${realHeight}`,
          className
        )}
        style={{ width: width }}
      />
    </div>
  );
};

export default SelectedLine;
