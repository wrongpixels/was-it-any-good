import { MergedCredits } from '../../../../../../shared/types/models';
import { AuthorType } from '../../../../../../shared/types/roles';
import { UNKNOWN_CREW } from '../../../../../../shared/defaults/media-defaults';
import BasePeopleSection from './BasePeopleSection';
import { JSX } from 'react';

interface CrewEntryProps {
  title: string;
  content?: string;
  crew?: MergedCredits[];
  filterRoles?: AuthorType[];
}

const CrewEntrySection = ({
  title,
  content,
  crew,
  filterRoles,
}: CrewEntryProps): JSX.Element | null => {
  let filteredCrew = crew ?? [];

  if (filterRoles && filterRoles.length > 0) {
    filteredCrew = filteredCrew.filter((c) =>
      c.mergedRoles.some((role) => filterRoles.includes(role))
    );
  }

  if (filteredCrew.length === 0) {
    if (crew) filteredCrew = UNKNOWN_CREW;
    else {
      return null;
    }
  }
  return (
    <BasePeopleSection title={title} content={content} people={filteredCrew} />
  );
};

export default CrewEntrySection;
