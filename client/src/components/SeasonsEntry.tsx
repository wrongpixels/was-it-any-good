import { JSX } from 'react';
import { SeasonResponse, ShowResponse } from '../../../shared/types/models';
import EntrySection from './EntrySection';
import SeasonPoster from './SeasonPoster';

interface SeasonsEntryProps {
  show: ShowResponse;
}

const SeasonsEntry = ({ show }: SeasonsEntryProps): JSX.Element | null => {
  if (!show.seasons) {
    return null;
  }
  return (
    <div className="mt-4 border-t border-gray-200">
      <EntrySection title="Seasons" content=" " />
      <div className="flex flex-row gap-2">
        {show.seasons.map((s: SeasonResponse) => (
          <div key={s.id}>
            <SeasonPoster media={s} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonsEntry;
