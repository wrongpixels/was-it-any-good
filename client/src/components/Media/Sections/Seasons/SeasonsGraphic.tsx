import { JSX } from 'react';
import { isUnreleased } from '../../../../../../shared/helpers/media-helper';
import { SeasonResponse } from '../../../../../../shared/types/models';
import { roundRatingForGraph } from '../../../../../../shared/util/rating-average-calculator';

const GRAPH_HEIGHT: number = 70 as const;

interface SeasonsGraphicProps {
  seasons: SeasonResponse[];
}

const SeasonsGraphic = ({ seasons }: SeasonsGraphicProps) => {
  if (seasons.length < 2) {
    return null;
  }
  return (
    <div className="bg-gradient-to-t from-gray-200/50 to-gray-50 w-fit border border-gray-300 mb-3 p-2 pb-1 rounded shadow-md/10">
      <div
        className={
          'flex flex-row gap-1 items-baseline-last w-fit justify-baseline bg-gradient-to-t from-gray-100 via-gray-100 to-gray-200/50 rounded'
        }
      >
        {seasons.map((s: SeasonResponse) => (
          <div className="flex flex-col items-center">
            <SeasonBar season={s} key={s.id} />
            <span className="text-xs text-gray-400 pt-0.75 font-semibold">
              {s.index}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SeasonBar = ({ season }: { season: SeasonResponse }): JSX.Element => {
  const adjustedHeight: number = roundRatingForGraph(
    GRAPH_HEIGHT * (season.rating / 10)
  );
  const unreleased: boolean = isUnreleased(season.releaseDate);
  const rating: number = season.rating;

  return (
    <div
      className="relative min-w-5 w-max"
      style={{ height: `${GRAPH_HEIGHT}px` }}
    >
      <div
        style={{ height: `${GRAPH_HEIGHT}px` }}
        className={
          'absolute bottom-0 min-w-5 w-max bg-gradient-to-t from-gray-200 to-gray-300/30 rounded-xs border border-gray-300'
        }
      />
      {unreleased || rating === 0 ? (
        <div
          title={`Season ${season.index}\n${unreleased ? 'Unreleased' : 'Not enough votes'}`}
          style={{ height: `${GRAPH_HEIGHT}px` }}
          className="absolute bottom-0 min-w-5 w-max text-center justify-center align-middle items-center translate-y-5 cursor-pointer hover:scale-105"
        >
          <span>?</span>
        </div>
      ) : (
        <div
          style={{ height: `${adjustedHeight}px` }}
          title={`Season ${season.index}\nScore: ${rating > 0 ? rating : 'Not enough votes'}`}
          className={`cursor-pointer transition-all duration-75 hover:scale-105 absolute bottom-0 min-w-5 w-max bg-gradient-to-t
  ${
    rating >= 7
      ? 'from-starblue'
      : rating >= 6
        ? 'from-stardarker'
        : 'from-red-500'
  }
  ${
    rating < 5
      ? 'to-red-300'
      : rating < 6
        ? 'to-starbrighter'
        : rating >= 8.5
          ? 'to-green-400/50'
          : rating >= 8
            ? 'to-stargreen via-starbrighter'
            : 'to-starbrightest'
  }
  rounded-xs border border-starbrighter`}
        />
      )}
    </div>
  );
};

export default SeasonsGraphic;
