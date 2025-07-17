import { JSX } from 'react';
import { OptStringProps } from '../../../types/common-props-types';
import { setTitle } from '../../../utils/page-info-setter';
import LoadingSpinner from '../icons/LoadingSpinner';
import { ClassNameValue } from 'tailwind-merge';

interface SpinnerPageProps extends OptStringProps {
  spinnerColor?: ClassNameValue;
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
    <div className="flex flex-row gap-2 justify-center w-full font-medium text-xl items-center whitespace-pre-line">
      <LoadingSpinner className={spinnerColor} />
      {text}
    </div>
  );
};
export default SpinnerPage;
