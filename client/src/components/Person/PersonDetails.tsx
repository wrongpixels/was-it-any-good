import { JSX } from 'react';
import { PersonResponse } from '../../../../shared/types/models';
import { formatDate } from '../../../../shared/helpers/format-helper';

interface PersonDetailsProps {
  person: PersonResponse;
}

const PersonDetails = ({ person }: PersonDetailsProps): JSX.Element | null => {
  if (!person) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <AgeSection title="Born" text={person.birthDate} />
      <Section title="Place of Birth" text={person.birthPlace} />
      <Section title="Death" text={person.deathDate} />
    </div>
  );
};

interface SectionProps {
  title?: string;
  text?: string;
}

const AgeSection = ({ title, text }: SectionProps): JSX.Element | null => {
  if (!title || !text) {
    return null;
  }
  const formattedDate: string = formatDate(text);
  return <Section title={title} text={formattedDate} />;
};

const Section = ({ title, text }: SectionProps): JSX.Element | null => {
  if (!title || !text) {
    return null;
  }
  return (
    <div className="flex flex-col text-sm">
      <span className="font-semibold">
        {title}
        {':'}
      </span>
      <span className="text-gray-500">{text}</span>
    </div>
  );
};

export default PersonDetails;
