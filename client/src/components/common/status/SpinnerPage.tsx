import { JSX } from 'react';
import { OptStringProps } from '../../../types/common-props-types';
import { setTitle } from '../../../utils/page-info-setter';
import IconLoadingSpinner from '../Icons/IconLoadingSpinner';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';

interface SpinnerPageProps extends OptStringProps {
  spinnerColor?: string;
  paddingTop?: number;
}

const SpinnerPage = ({
  text,
  spinnerColor = 'text-starblue',
  paddingTop = 5,
  className,
}: SpinnerPageProps): JSX.Element | null => {
  if (!text) {
    return null;
  }
  const paddingString: string = `pt-${paddingTop}`;
  setTitle(text);
  return (
    <div
      className={mergeClassnames(
        `m-0 flex flex-row gap-2 justify-center w-full font-medium text-xl items-center whitespace-pre-line ${paddingString}`,
        className
      )}
    >
      <IconLoadingSpinner className={spinnerColor} />
      <h1 className="font-medium">{text}</h1>
    </div>
  );
};
export default SpinnerPage;
