import { JSX } from "react";
import { CreditResponse, MergedCredits } from "../../../shared/types/models";
import { useVerticalScroll } from "../hooks/scroller";
import { isMerged } from "../utils/credits-merger";

interface PeopleEntryProps {
  people: CreditResponse[] | MergedCredits[];
}

const getExtraInfo = (person: CreditResponse | MergedCredits): string =>
  isMerged(person)
    ? person.mergedRoles.join(", ")
    : `As ${person.characterName?.join(", ")}`;

const PeopleEntry = ({ people }: PeopleEntryProps): JSX.Element | null => {
  const reference: React.RefObject<HTMLDivElement | null> = useVerticalScroll();
  if (!people || people.length < 1) {
    return null;
  }
  return (
    <div
      className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide"
      ref={reference}
    >
      {people
        .filter(
          (credit: CreditResponse | MergedCredits) =>
            credit.person?.name && credit.person.id
        )
        .map((c) => (
          <div
            key={c.person.id}
            className="flex-shrink-0 flex flex-col items-center"
          >
            <img
              src={c.person.image}
              alt={c.person.name}
              title={c.person.name}
              className="w-24 h-auto rounded shadow-md border border-neutral-300"
              loading="lazy"
            />
            <div className="block mt-1 w-26 text-center overflow-hidden text-ellipsis leading-tight line-clamp-2">
              <a className="font-medium text-sm">{c.person.name}</a>
              <div className="text-gray-500 text-xs">{getExtraInfo(c)}</div>
            </div>
          </div>
        ))}
    </div>
  );
};
export default PeopleEntry;
