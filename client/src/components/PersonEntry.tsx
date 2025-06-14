import { JSX } from 'react';
import { CreditResponse, MergedCredits } from '../../../shared/types/models';
import { useVerticalScroll } from '../hooks/scroller';
import { isMerged } from '../utils/credits-merger';

interface PeopleEntryProps {
  people: CreditResponse[] | MergedCredits[];
}

const getExtraInfo = (person: CreditResponse | MergedCredits): string =>
  isMerged(person)
    ? person.mergedRoles.join(', ')
    : person.characterName?.join(', ') || 'Unknown';

const PeopleEntry = ({ people }: PeopleEntryProps): JSX.Element | null => {
  const reference: React.RefObject<HTMLDivElement | null> = useVerticalScroll();
  if (!people || people.length < 1) {
    return null;
  }
  return (
    <div
      className="flex overflow-x-auto p-1 space-x-2 scrollbar-hide"
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
            className="flex-shrink-0 flex flex-col bg-white items-center shadow-md rounded border border-5 border-white ring-1 ring-gray-300 pt-1"
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
  );
};
export default PeopleEntry;
