import { JSX } from 'react';
import { OptStringProps } from '../../../types/common-props-types';
import { setTitle } from '../../../utils/page-info-setter';
import LoadingSpinner from '../icons/LoadingSpinner';

interface SpinnerPageProps extends OptStringProps {
  spinnerColor?: string;
}

const SpinnerPage = ({
  text,
  spinnerColor = 'text-starblue',
}: SpinnerPageProps): JSX.Element | null => {
  if (!text) {
    return null;
  }
  setTitle(text);
  return (
    <div className="m-0 flex flex-row gap-2 justify-center w-full font-medium text-xl items-center whitespace-pre-line">
      <LoadingSpinner className={spinnerColor} />
      <h1 className="font-medium">{text}</h1>
    </div>
  );
};
export default SpinnerPage;
