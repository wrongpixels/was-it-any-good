import { JSX } from 'react';
import { OptBoolProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface SeparatorProps extends OptBoolProps {
  margin?: boolean;
}

const Separator = ({
  margin = true,
  className,
}: SeparatorProps): JSX.Element => (
  <div
    className={mergeClassnames(
      `border-t border-gray-200 ${margin ? 'mt-3' : ''}`,
      className
    )}
  />
);

export default Separator;
