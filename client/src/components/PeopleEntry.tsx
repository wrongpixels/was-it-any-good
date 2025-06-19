import { JSX } from 'react';
import { CreditResponse, MergedCredits } from '../../../shared/types/models';
import { ScrollData, useVerticalScroll } from '../hooks/scroller';
import { isMerged } from '../utils/credits-merger';

interface PeopleEntryProps {
  people: CreditResponse[] | MergedCredits[];
}

const getExtraInfo = (person: CreditResponse | MergedCredits): string =>
  isMerged(person)
    ? person.mergedRoles.join(', ')
    : person.characterName?.join(', ') || 'Unknown';

const PeopleEntry = ({ people }: PeopleEntryProps): JSX.Element | null => {
  const { reference, canScrollR, canScrollL }: ScrollData = useVerticalScroll();
  if (!people || people.length < 1) {
    return null;
  }
  return (
    <div className="relative">
      {canScrollL && (
        <div className="absolute left-0 pl-5 top-0 h-full w-6 bg-gradient-to-r from-gray-50 to-transparent z-1" />
      )}
      {canScrollR && (
        <div className="absolute right-0 pr-5 top-0 h-full w-6 bg-gradient-to-l from-gray-50 to-transparent z-1" />
      )}
      <div
        className="flex overflow-x-auto p-1 space-x-2 scrollbar-hide "
        ref={reference}
      >
        {people
          .filter(
            (credit: CreditResponse | MergedCredits) =>
              credit.person?.name && credit.person.id
          )
          .map((c) => (
            <a
              key={c.person.id}
              className="flex-shrink-0 flex flex-col bg-white items-center shadow-md rounded border-5 border-white ring-1 ring-gray-300 pt-1"
            >
              <img
                src={c.person.image}
                alt={c.person.name}
                title={c.person.name}
                className="w-26 rounded h-auto shadow ring-1 ring-gray-300"
                loading="lazy"
              />
              <div className="block w-28 text-center overflow-hidden text-ellipsis py-1">
                <div className="font-medium text-sm leading-none m-1.5">
                  {c.person.name}
                </div>
                <div className="text-gray-500 text-xs leading-tight font-medium">
                  {getExtraInfo(c)}
                </div>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
};
export default PeopleEntry;
