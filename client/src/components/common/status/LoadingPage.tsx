import { OptStringProps } from '../../../types/common-props-types';
import { setTitle } from '../../../utils/page-info-setter';
import LoadingSpinner from '../icons/LoadingSpinner';

const LoadingPage = ({ text }: OptStringProps) => {
  const displayString: string = `Loading${text ? ` ${text}` : ''}...`;

  setTitle(displayString);
  return (
    <div className="flex flex-row gap-2 justify-center w-full font-medium text-xl items-center whitespace-pre-line">
      <LoadingSpinner />
      {displayString}
    </div>
  );
};
export default LoadingPage;
