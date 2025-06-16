import { JSX } from 'react';

interface PropsStarRating {
  rating: number;
  valid?: boolean;
  season?: boolean;
}

const STARS: string = '★★★★★';

const StarRating = ({
  rating,
  valid = true,
  season = false,
}: PropsStarRating): JSX.Element | null => {
  if (!rating) {
    return null;
  }
  return (
    <div
      className={`relative inline-block ${season ? 'text-2xl' : 'text-3xl'}`}
    >
      <div className="text-gray-300">{STARS}</div>
      <div
        className="absolute top-0 left-0 overflow-hidden"
        style={{ width: `${rating * 10}%` }}
      >
        <div className="text-[#6d90cf]">{STARS}</div>
      </div>
      {valid && rating > 0 ? (
        <div
          className={`${season ? 'text-xl' : 'text-2xl'} font-bold text-gray-500`}
        >
          {rating}
        </div>
      ) : (
        <div className="text-sm text-gray-500 pt-1 pb-1 italic">
          Not enough ratings
        </div>
      )}
    </div>
  );
};

export default StarRating;
