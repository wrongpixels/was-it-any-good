import { OptStringProps } from '../../../types/common-props-types';
import { capitalize } from '../../../utils/common-format-helper';

const NotFoundPage = ({ text = 'Resource' }: OptStringProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="font-medium text-xl">
        {`${capitalize(text)} doesn't exist or couldn't be found!`}
      </div>
    </div>
  );
};

export default NotFoundPage;
