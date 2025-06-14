import { JSX } from 'react';

interface PropsStarRating {
  rating: number;
  valid?: boolean;
}

const STARS: string = '★★★★★';

const StarRating = ({
  rating,
  valid = true,
}: PropsStarRating): JSX.Element | null => {
  if (!rating) {
    return null;
  }
  return (
    <div className="relative inline-block text-3xl">
      <div className="text-gray-300">{STARS}</div>
      <div
        className="absolute top-0 left-0 overflow-hidden"
        style={{ width: `${rating * 10}%` }}
      >
        <div className="text-[#6d90cf]">{STARS}</div>
      </div>
      {valid ? (
        <div className="text-2xl font-bold text-gray-500">{rating}</div>
      ) : (
        <div className="text-xs text-gray-400">Not enough ratings</div>
      )}
    </div>
  );
};

export default StarRating;
