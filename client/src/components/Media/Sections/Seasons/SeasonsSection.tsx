import { JSX } from 'react';
import {
  SeasonResponse,
  ShowResponse,
} from '../../../../../../shared/types/models';
import EntrySection from '../../../EntrySection';
import SeasonPoster from '../../../Posters/SeasonPoster';

import { getVisibleSeasons } from '../../../../utils/seasons-setter';
import Separator from '../../../Common/Separator';
import ScrollableDiv from '../../../Common/Custom/ScrollableDiv';
import SeasonsGraphic from './SeasonsGraphic';

interface SeasonsSectionProps {
  show: ShowResponse;
}

const SeasonsSection = ({ show }: SeasonsSectionProps): JSX.Element | null => {
  if (!show.seasons) {
    return null;
  }
  //we hide Specials and other Seasons that are not relevant to us
  const visibleSeasons: SeasonResponse[] = getVisibleSeasons(show.seasons);
  const isSingleSeason: boolean = visibleSeasons.length === 1;
  return (
    <div>
      <Separator />
      <EntrySection title={`Seasons (${visibleSeasons.length})`} content=" " />
      <ScrollableDiv>
        <SeasonsGraphic seasons={visibleSeasons} />
      </ScrollableDiv>
      {visibleSeasons.length < 1 ? (
        <div>Show has no seasons.</div>
      ) : (
        <ScrollableDiv>
          {visibleSeasons.map((s: SeasonResponse) => (
            <div key={s.id}>
              <SeasonPoster media={s} singleSeason={isSingleSeason} />
            </div>
          ))}
        </ScrollableDiv>
      )}
    </div>
  );
};

export default SeasonsSection;
