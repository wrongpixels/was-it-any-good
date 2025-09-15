import { JSX } from 'react';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import { OptStringProps } from '../../../types/common-props-types';

const Tag = ({
  text,
  title,
  className,
}: OptStringProps): JSX.Element | null => {
  if (!text) {
    return null;
  }
  return (
    <div
      title={title ?? text}
      className={mergeClassnames(
        'cursor-pointer absolute text-white text-xs bg-starbright rounded-full px-2 py-0.5 shadow/60',
        className
      )}
    >
      {text}
    </div>
  );
};

export default Tag;
