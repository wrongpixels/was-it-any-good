import { OptClassNameProps } from '../../../types/common-props-types';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';

interface LoadingCardsProps extends OptClassNameProps {
  placeholderCount?: number;
}

const LoadingCards = ({
  placeholderCount = 21,
  className,
}: LoadingCardsProps) => {
  const gridClassName = 'grid grid-cols-3 gap-4';

  return (
    <div className={mergeClassnames(gridClassName, className)}>
      {[...Array(placeholderCount)].map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
};
export const LoadingCard = () => {
  const cardClassName =
    'relative h-48 w-77.5 animate-pulse rounded bg-gradient-to-t from-gray-300 to-gray-300 via-gray-300/70 shadow';
  return (
    <div className={cardClassName}>
      <LoadingCardContent />
    </div>
  );
};
const LoadingCardContent = () => {
  return (
    <>
      <div className="absolute left-2 top-2 h-44 w-29.5 rounded-lg bg-gray-400/50" />
      <div className="absolute left-35 top-5 h-5 w-30 rounded-lg bg-gray-400/50" />
      <div className="absolute left-35 top-12 h-5 w-20 rounded-lg bg-gray-400/50" />
      <div className="absolute left-50.5 top-31.5 h-7 w-9 rounded-lg bg-gray-400/50" />
      <div className="absolute left-42 top-40.5 h-5 w-26 rounded-lg bg-gray-400/50" />
    </>
  );
};

export default LoadingCards;
