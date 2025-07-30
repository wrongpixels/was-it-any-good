import { JSX } from 'react';
import { CreditResponse, MergedCredits } from '../../../../shared/types/models';
import {
  ScrollData,
  useVerticalScroll,
} from '../../hooks/use-verticall-scroll';
import { isMerged } from '../../utils/credits-merger';
import { Link } from 'react-router-dom';
import { styles } from '../../constants/tailwind-styles';

interface MediaPeopleEntryProps {
  people: CreditResponse[] | MergedCredits[];
}

const getExtraInfo = (person: CreditResponse | MergedCredits): string =>
  isMerged(person)
    ? person.mergedRoles.join(', ')
    : person.characterName?.join(', ') || 'Unknown';

const MediaPeopleEntry = ({
  people,
}: MediaPeopleEntryProps): JSX.Element | null => {
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
        className="flex overflow-x-auto p-1.5 space-x-2 scrollbar-hide"
        ref={reference}
      >
        {people
          .filter(
            (credit: CreditResponse | MergedCredits) =>
              credit.person?.name && credit.person.id
          )
          .map((c) => (
            <Link
              to={`/person/${c.person.id}`}
              key={c.person.id}
              className={`flex-shrink-0 flex flex-col bg-white items-center shadow-md rounded border-5 border-white ring-1 ring-gray-300 pt-1 ${styles.animations.upOnHoverShort} ${styles.animations.zoomLessOnHover}`}
            >
              <img
                src={c.person.image}
                alt={c.person.name}
                title={c.person.name}
                className="w-26 rounded h-auto shadow ring-1 ring-gray-300"
                loading="lazy"
              />
              <div className="w-28 flex flex-col items-center text-center py-1.5 flex-grow">
                <div className="flex-grow flex items-center justify-center px-0.5">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="font-medium text-sm leading-tight break-words line-clamp-2"
                      title={c.person.name}
                    >
                      {c.person.name}
                    </div>
                    <div
                      className="text-gray-500 text-xs font-normal leading-tight line-clamp-2"
                      title={getExtraInfo(c)}
                    >
                      {getExtraInfo(c)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
export default MediaPeopleEntry;
