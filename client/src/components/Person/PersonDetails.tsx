import { JSX } from 'react';
import { PersonResponse } from '../../../../shared/types/models';
import {
  formatDate,
  getAge,
  tryAddParenthesis,
} from '../../../../shared/helpers/format-helper';
import CountryFlags from '../Media/Sections/MediaCountryFlags';
import { CountryCode } from '../../../../shared/types/countries';

interface PersonDetailsProps {
  person: PersonResponse;
}

const PersonDetails = ({ person }: PersonDetailsProps): JSX.Element | null => {
  if (!person) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <BornSection title="Born" text={person.birthDate} />
      <BirthPlaceSection
        title="Place of Birth"
        text={person.birthPlace}
        countryCodes={person.country}
      />
      <Section
        title="Death"
        text={person.deathDate ? formatDate(person.deathDate) : undefined}
      />
    </div>
  );
};

interface SectionProps {
  title?: string;
  text?: string;
}

interface BirthPlaceProps extends SectionProps {
  countryCodes?: CountryCode[];
}

const BirthPlaceSection = ({
  title,
  text,
  countryCodes,
}: BirthPlaceProps): JSX.Element | null => {
  if (!title || !text) {
    return null;
  }
  //we don't want provinces, states and so, we just keep city and country max
  const birthSections: string[] = text.split(', ');
  const displayBirthPlace: string =
    birthSections.length <= 2
      ? text
      : `${birthSections[0]}, ${birthSections.pop()}`;
  return (
    <span className="flex flex-col text-sm">
      <span className="font-bold text-gray-500">
        {title}
        {':'}
      </span>
      <div className="flex flex-row gap-2">
        <span className="text-gray-600">{displayBirthPlace}</span>
        {countryCodes && (
          <CountryFlags countryCodes={countryCodes} className="pt-0" />
        )}
      </div>
    </span>
  );
};

const BornSection = ({ title, text }: SectionProps): JSX.Element | null => {
  if (!title || !text) {
    return null;
  }
  const formattedDate: string = formatDate(text);
  const age: number | null = getAge(text);
  const displayAge: string = !age ? '' : tryAddParenthesis(`age ${age}`);
  const displayBorn: string = !displayAge
    ? formattedDate
    : `${formattedDate} ${displayAge}`;

  return <Section title={title} text={displayBorn} />;
};

const Section = ({ title, text }: SectionProps): JSX.Element | null => {
  if (!title || !text) {
    return null;
  }
  return (
    <span className="flex flex-col text-sm">
      <span className="font-bold text-gray-500">
        {title}
        {':'}
      </span>
      <span className="text-gray-600">{text}</span>
    </span>
  );
};

export default PersonDetails;
