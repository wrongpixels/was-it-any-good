import { JSX } from 'react';
import {
  SeasonResponse,
  ShowResponse,
} from '../../../../../shared/types/models';
import EntrySection from '../../EntrySection';
import SeasonPoster from '../../Posters/SeasonPoster';

import { isSpecialSeason } from '../../../utils/seasons-setter';
import Separator from '../../Common/Separator';
import ScrollableDiv from '../../Common/Custom/ScrollableDiv';
import { roundRatingForGraph } from '../../../../../shared/util/rating-average-calculator';
import { isUnreleased } from '../../../../../shared/helpers/media-helper';

const GRAPH_HEIGHT: number = 70 as const;

interface SeasonsSectionProps {
  show: ShowResponse;
}

interface SeasonsGraphicProps {
  seasons: SeasonResponse[];
}

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
          className={`cursor-pointer transition-all duration-75 hover:scale-105 absolute bottom-0 min-w-5 w-max bg-gradient-to-t ${rating >= 8.5 ? 'from-notigreen' : rating >= 7.5 ? 'from-starblue' : rating < 5 ? 'from-notired' : rating >= 7 ? 'from-gold' : 'from-orange-400'} ${rating >= 8.5 ? 'to-green-400/50' : rating >= 8 ? 'to-stargreen' : rating >= 7.5 ? 'to-starbrightest' : rating > 7 ? 'to-orange-200' : season.rating < 5 ? 'to-gold' : 'to-gold-bright'} rounded-xs border border-starbrighter`}
        />
      )}
    </div>
  );
};

const SeasonsGraphic = ({ seasons }: SeasonsGraphicProps) => {
  if (seasons.length < 2) {
    return null;
  }
  return (
    <div className="ml-1 bg-gradient-to-t from-gray-200/50 to-gray-50 w-fit border border-gray-300 mb-3 p-2 rounded shadow-md/10">
      <div
        style={{ height: `${GRAPH_HEIGHT}px` }}
        className={
          'flex flex-row gap-1 items-baseline-last w-fit justify-baseline bg-gradient-to-t from-gray-100 via-gray-100 to-gray-200/50 rounded'
        }
      >
        {seasons.map((s: SeasonResponse) => (
          <SeasonBar season={s} key={s.id} />
        ))}
      </div>
    </div>
  );
};

const SeasonsSection = ({ show }: SeasonsSectionProps): JSX.Element | null => {
  if (!show.seasons) {
    return null;
  }
  //we hide Specials and other Seasons that are not relevant to us
  const visibleSeasons: SeasonResponse[] = show.seasons.filter(
    (s: SeasonResponse) => !isSpecialSeason(s)
  );
  return (
    <div>
      <Separator />
      <EntrySection title={`Seasons (${visibleSeasons.length})`} content=" " />
      <SeasonsGraphic seasons={visibleSeasons} />
      {visibleSeasons.length < 1 ? (
        <div>Show has no seasons.</div>
      ) : (
        <ScrollableDiv>
          {visibleSeasons.map((s: SeasonResponse) => (
            <div key={s.id}>
              <SeasonPoster media={s} />
            </div>
          ))}
        </ScrollableDiv>
      )}
    </div>
  );
};

export default SeasonsSection;
