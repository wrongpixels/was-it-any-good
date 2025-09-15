import { JSX } from 'react';
import { setTitle } from '../utils/page-info-setter';

const NotFound = (): JSX.Element => {
  setTitle('Not found');
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-8">
      <span className="font-bold text-2xl">{'Page not found!'}</span>
      <span className="font-normal text-lg text-gray-400 italic">
        {'(And we really tried)'}
      </span>
    </div>
  );
};

export default NotFound;
