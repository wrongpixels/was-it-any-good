import { JSX } from 'react';
import { OptClassNameProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface PlaceholderPosterProps extends OptClassNameProps {
  placeholderCount: number;
}

const defClassName: string =
  'bg-gradient-to-t from-gray-200/80 to-gray-200/40  via-gray-200/40 w-42 rounded border border-gray-500/30 border-dashed';

const PlaceholderPoster = ({
  placeholderCount = 1,
  className,
}: PlaceholderPosterProps): JSX.Element | null => {
  if (!placeholderCount) {
    return null;
  }
  return (
    <>
      {[...Array(placeholderCount)].map((_, i) => (
        <span
          key={i}
          className={mergeClassnames(defClassName, className)}
        ></span>
      ))}
    </>
  );
};

export default PlaceholderPoster;
