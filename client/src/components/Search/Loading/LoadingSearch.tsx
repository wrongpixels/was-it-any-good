import { OptClassNameProps } from '../../../types/common-props-types';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';

const cardClassName =
  'bg-gradient-to-t from-gray-300 to-gray-300 via-gray-300/70 w-77.5 rounded h-48 shadow animate-pulse';

interface LoadingCardsProps extends OptClassNameProps {
  placeholderCount?: number;
}

const LoadingCards = ({
  placeholderCount = 21,
  className,
}: LoadingCardsProps) => {
  const gridCols = 'grid grid-cols-3 gap-4';
  return (
    <div className={mergeClassnames(gridCols, className)}>
      {[...Array(placeholderCount)].map((_, i) => (
        <span key={i} className={cardClassName} />
      ))}
    </div>
  );
};

export default LoadingCards;
