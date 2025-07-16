import { JSX } from 'react';
import LazyImage from '../common/LazyImage';

interface BasicPosterProps {
  src: string;
  alt: string;
  title?: string;
}

const BasicPoster = (props: BasicPosterProps): JSX.Element => {
  return (
    <div className="inline-block bg-white shadow-md rounded border-9 border-white ring-1 ring-gray-300 self-start">
      <LazyImage {...props} className="rounded shadow ring-1 ring-gray-300" />
    </div>
  );
};

export default BasicPoster;
