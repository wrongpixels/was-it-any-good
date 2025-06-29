import { JSX } from 'react';
import { SeasonResponse, ShowResponse } from '../../../../shared/types/models';
import EntrySection from '../EntrySection';
import SeasonPoster from '../Poster/SeasonPoster';
import { ScrollData, useVerticalScroll } from '../../hooks/scroller';
import { isSpecialSeason } from '../../utils/seasons-setter';

interface SeasonsEntryProps {
  show: ShowResponse;
}

const SeasonsEntry = ({ show }: SeasonsEntryProps): JSX.Element | null => {
  const { reference, canScrollR, canScrollL }: ScrollData = useVerticalScroll();

  if (!show.seasons) {
    return null;
  }
  return (
    <div>
      <EntrySection title={`Seasons (${show.seasonCount})`} content=" " />

      <div className="flex-1 overflow-x-hidden relative">
        {canScrollL && (
          <div className="absolute left-0 pl-5 top-0 h-full w-6 bg-gradient-to-r from-gray-50 to-transparent z-1" />
        )}
        {canScrollR && (
          <div className="absolute right-0 pr-5 top-0 h-full w-6 bg-gradient-to-l from-gray-50 to-transparent z-1" />
        )}
        <div
          className="flex overflow-x-auto p-1 space-x-2 scrollbar-hide"
          ref={reference}
        >
          {show.seasons
            .filter((s: SeasonResponse) => !isSpecialSeason(s))
            .map((s: SeasonResponse) => (
              <div key={s.id}>
                <SeasonPoster media={s} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonsEntry;
