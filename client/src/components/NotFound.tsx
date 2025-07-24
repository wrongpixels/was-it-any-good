import { JSX } from 'react';

const NotFound = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <span className="font-bold text-2xl"> Page not found!</span>
      <span className="font-normal text-lg">(And we really tried)</span>
    </div>
  );
};

export default NotFound;
