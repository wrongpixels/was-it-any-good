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

interface SeasonsSectionProps {
  show: ShowResponse;
}

const SeasonsSection = ({ show }: SeasonsSectionProps): JSX.Element | null => {
  if (!show.seasons) {
    return null;
  }
  return (
    <div>
      <Separator />
      <EntrySection title={`Seasons (${show.seasonCount})`} content=" " />
      {show.seasons.length < 1 ? (
        <div>Show has no seasons.</div>
      ) : (
        <ScrollableDiv>
          {show.seasons
            .filter((s: SeasonResponse) => !isSpecialSeason(s))
            .map((s: SeasonResponse) => (
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
