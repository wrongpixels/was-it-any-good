import { JSX } from 'react';

interface PosterPorps {
  src: string;
  alt: string;
  title?: string;
}

const Poster = (props: PosterPorps): JSX.Element => {
  return (
    <div className="inline-block bg-white shadow-md rounded border-9 border-white ring-1 ring-gray-300 self-start">
      <img
        {...props}
        className="rounded shadow ring-1 ring-gray-300"
        loading="lazy"
      />
    </div>
  );
};

export default Poster;
