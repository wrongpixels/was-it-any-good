import { JSX } from 'react';

const NotFound = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="font-bold text-2xl"> Page not found!</div>
      <div className="font-normal text-lg">(And we really tried)</div>
    </div>
  );
};

export default NotFound;
