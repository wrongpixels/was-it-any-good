import { JSX } from 'react';
import LoadingSpinner from '../../../common/icons/IconLoadingSpinner';
import { OptBoolProps } from '../../../../types/common-props-types';
import Separator from '../../../common/Separator';

const LoadingSearchRow = ({ condition }: OptBoolProps): JSX.Element | null => {
  if (!condition) {
    return null;
  }

  return (
    <div>
      <Separator margin={false} />
      <div
        key="loading-search"
        className={`flex flex-row min-w-50 items-center font-medium relative px-1.5 py-0.5 rounded-lg}`}
      >
        <LoadingSpinner className="w-3" />
        <div>
          <span className="font-light pl-3">Loading results…</span>
        </div>
      </div>
    </div>
  );
};
export default LoadingSearchRow;
