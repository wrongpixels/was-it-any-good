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
      `h-0 w-full flex flex-col ${margin ? 'sm:mt-3 mt-2' : ''}`,
      className
    )}
  >
    <span className="border-t border-black/7 h-0" />
    <span className="border-t border-white pt-1 h-0" />
  </div>
);

export default Separator;
