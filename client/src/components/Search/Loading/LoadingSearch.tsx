import { styles } from '../../../constants/tailwind-styles';
import { OptClassNameProps } from '../../../types/common-props-types';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import SpinnerPage from '../../Common/Status/SpinnerPage';

interface LoadingCardsProps extends OptClassNameProps {
  placeholderCount?: number;
  showNavBar?: boolean;
  loadTitle?: string;
}

const LoadingCards = ({
  placeholderCount = 21,
  className,
  showNavBar,
  loadTitle = 'Searching',
}: LoadingCardsProps) => {
  const gridClassName = 'grid grid-cols-3 gap-4 animate-pulse';

  return (
    <div>
      {showNavBar && (
        <div className="grid grid-cols-3 pb-4.5 items-center">
          <div className="h-9.5 flex flex-row gap-2 items-center animate-pulse">
            <span className={`w-13 h-5 rounded-full ${styles.loadingMedia}`} />
            <span className={`w-23.5 h-full ${styles.loadingMedia}`} />
            <span className={`w-6.5 h-full ${styles.loadingMedia}`} />
          </div>
          <div className={'justify-self-center'}>
            <SpinnerPage
              text={`${loadTitle}...`}
              paddingTop={0}
              className="-translate-y-0.5 text-lg"
            />
          </div>
          <div className="h-8 flex flex-row gap-1.5 items-center justify-self-end mr-0.25 animate-pulse">
            <span className={`w-22 h-5 rounded-full ${styles.loadingMedia}`} />
            <span className={`w-8 h-full ${styles.loadingMedia}`} />
            <span className={`w-8 h-full ${styles.loadingMedia}`} />
          </div>
        </div>
      )}
      <div className={mergeClassnames(gridClassName, className)}>
        {[...Array(placeholderCount)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </div>
  );
};
export const LoadingCard = () => {
  const cardClassName = `relative h-48 w-77.5 ${styles.loadingMedia}`;
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
