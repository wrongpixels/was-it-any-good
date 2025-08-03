import { JSX, useMemo } from 'react';
import { CreditResponse, MergedCredits } from '../../../../shared/types/models';
import {
  ScrollData,
  useVerticalScroll,
} from '../../hooks/use-verticall-scroll';
import MediaPersonPoster from './MediaPersonPoster';

interface MediaPeopleEntryProps {
  people: CreditResponse[] | MergedCredits[];
}

const MediaPeopleEntry = ({
  people,
}: MediaPeopleEntryProps): JSX.Element | null => {
  const { reference, canScrollR, canScrollL }: ScrollData = useVerticalScroll();
  if (!people || people.length < 1) {
    return null;
  }

  //we memo the posters to avoid re-calculating them on scroll
  const PeopleCredits: JSX.Element[] = useMemo(
    () =>
      people
        .filter(
          (credit: CreditResponse | MergedCredits) =>
            !!credit.person?.name && !!credit.person.id
        )
        .map((c: CreditResponse | MergedCredits) => (
          <MediaPersonPoster credit={c} />
        )),
    [people]
  );

  return (
    <div className="relative">
      {canScrollL && (
        <div className="absolute left-0 pl-5 top-0 h-full w-6 bg-gradient-to-r from-gray-50 to-transparent z-1" />
      )}
      {canScrollR && (
        <div className="absolute right-0 pr-5 top-0 h-full w-6 bg-gradient-to-l from-gray-50 to-transparent z-1" />
      )}
      <div
        className="flex overflow-x-auto p-1.5 space-x-2 scrollbar-hide"
        ref={reference}
      >
        {PeopleCredits}
      </div>
    </div>
  );
};
export default MediaPeopleEntry;
