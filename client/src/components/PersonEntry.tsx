import { JSX } from "react";
import { CreditResponse } from "../../../shared/types/models";
import { useVerticalScroll } from "../hooks/scroller";

interface PeopleEntryProps {
  people: CreditResponse[];
}

const PeopleEntry = ({ people }: PeopleEntryProps): JSX.Element | null => {
  const reference: React.RefObject<HTMLDivElement | null> = useVerticalScroll();
  if (!people || people.length < 1) {
    return null;
  }
  return (
    <div
      className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide"
      ref={reference}
    >
      {people
        .filter(
          (credit: CreditResponse) => credit.person?.name && credit.person.id
        )
        .map((c) => (
          <div key={c.id} className="flex-shrink-0 flex flex-col items-center">
            <img
              src={c.person.image}
              alt={c.person.name}
              title={c.person.name}
              className="w-24 h-auto rounded shadow-md	border border-neutral-300"
              loading="lazy"
            />
            <span className="text-sm mt-2">{c.person.name}</span>
          </div>
        ))}
    </div>
  );
};
export default PeopleEntry;
