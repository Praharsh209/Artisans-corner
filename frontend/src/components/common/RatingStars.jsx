import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, numReviews, interactive = false, onRatingChange, size = 16 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {stars.map((star) => {
          const isFilled = rating >= star;
          const isHalf = rating >= star - 0.5 && rating < star;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              className={`${
                interactive ? 'cursor-pointer hover:scale-110 transition-transform p-0.5' : 'cursor-default'
              } text-amber-500`}
            >
              <Star
                size={size}
                className={`${
                  isFilled
                    ? 'fill-amber-500 text-amber-500'
                    : isHalf
                    ? 'fill-amber-300 text-amber-500'
                    : 'text-stone-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {numReviews !== undefined && (
        <span className="text-xs text-stone-500 font-medium ml-1">
          ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
