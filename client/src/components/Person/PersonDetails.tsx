import { JSX } from 'react';
import { PersonResponse } from '../../../../shared/types/models';
import {
  formatDate,
  getAge,
  tryAddParenthesis,
} from '../../../../shared/helpers/format-helper';
import CountryFlags from '../Media/Sections/MediaCountryFlags';
import { CountryCode } from '../../../../shared/types/countries';
import React from 'react';

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

  //if we have more than 3 parts in the location (city, region, state, country)
  //we just keep the 1st (city) + last 2 (state, country)
  const parts = text.split(', ');
  const displayBirthPlace =
    parts.length <= 3 ? text : `${parts[0]}, ${parts.slice(-2).join(', ')}`;

  const displayParts = displayBirthPlace.split(', ');

  return (
    <span className="flex flex-col text-sm">
      <span className="font-bold text-gray-500">{title}:</span>
      <span className="text-gray-600 flex flex-wrap items-baseline gap-1 break-words">
        {displayParts.slice(0, -1).map((part, index) => (
          <React.Fragment key={index}>{part}, </React.Fragment>
        ))}
        {/* we want the flag to wrap with the country so it doesn't look odd 
        when there's a line break only for the flag*/}
        <span className="whitespace-nowrap flex flex-row gap-1.5">
          {displayParts[displayParts.length - 1]}
          {countryCodes && (
            <>
              <CountryFlags
                countryCodes={countryCodes}
                className="inline-flex pt-0 self-start"
              />
            </>
          )}
        </span>
      </span>
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
