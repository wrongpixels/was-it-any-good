import { JSX } from 'react';
import { ShowResponse } from '../../../shared/types/models';
import EntrySection from './EntrySection';
import MediaPoster from './MediaPoster';

interface SeasonsEntryProps {
  show: ShowResponse;
}

const SeasonsEntry = ({ show }: SeasonsEntryProps): JSX.Element | null => {
  if (!show.seasons) {
    return null;
  }
  return (
    <div>
      <div>
        <EntrySection title="Seasons" content=" " />
      </div>
      <MediaPoster media={show.seasons[0]} />
    </div>
  );
};

export default SeasonsEntry;
