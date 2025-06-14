import { JSX } from 'react';

interface PropsStarRating {
  rating: number;
  valid?: boolean;
}

const StarRating = ({
  rating,
  valid = true,
}: PropsStarRating): JSX.Element | null => {
  if (!rating) {
    return null;
  }
  return (
    <div className="text-gray-400 text-center">
      <div className="text-3xl">★★★★★</div>
      {!valid && (
        <div className="text-xs text-gray-400 italic">Not enough ratings</div>
      )}
    </div>
  );
};

export default StarRating;
