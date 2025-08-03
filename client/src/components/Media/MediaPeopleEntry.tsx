import { JSX, useMemo } from 'react';
import { CreditResponse, MergedCredits } from '../../../../shared/types/models';
import MediaPersonPoster from './MediaPersonPoster';
import ScrollableDiv from '../common/ScrollableDiv';

interface MediaPeopleEntryProps {
  people: CreditResponse[] | MergedCredits[];
}

const MediaPeopleEntry = ({
  people,
}: MediaPeopleEntryProps): JSX.Element | null => {
  if (!people || people.length < 1) {
    return null;
  }

  //we memo the posters to avoid re-building them on scroll
  const PeopleCredits: JSX.Element[] = useMemo(
    () =>
      people
        .filter(
          (credit: CreditResponse | MergedCredits) =>
            !!credit.person?.name && !!credit.person.id
        )
        .map((c: CreditResponse | MergedCredits) => (
          <MediaPersonPoster key={c.person.id} credit={c} />
        )),
    [people]
  );
  return <ScrollableDiv>{PeopleCredits}</ScrollableDiv>;
};
export default MediaPeopleEntry;
