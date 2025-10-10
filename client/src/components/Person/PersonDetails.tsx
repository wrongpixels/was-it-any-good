import { JSX } from 'react';
import CountryFlags from '../Media/Sections/MediaCountryFlags';
import React from 'react';
import { PersonDetailsValues } from '../../utils/person-details-builder';

interface PersonDetailsProps {
  personValues: PersonDetailsValues;
}

const PersonDetails = ({
  personValues,
}: PersonDetailsProps): JSX.Element | null => {
  if (!personValues) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <Section title="Born" text={personValues.displayBornDate} />
      <Section title="Death" text={personValues.displayDeathDate} />
      <BirthPlaceSection title="Place of Birth" personValues={personValues} />
    </div>
  );
};

interface SectionProps {
  title?: string;
  text?: string;
}

interface BirthPlaceProps extends SectionProps {
  personValues: PersonDetailsValues;
}

const BirthPlaceSection = ({
  title,
  personValues,
}: BirthPlaceProps): JSX.Element | null => {
  if (!personValues.displayParts) {
    return null;
  }

  return (
    <span className="flex flex-col text-sm">
      <span className="font-bold text-gray-500">{title}:</span>
      <span className="text-gray-600 flex flex-wrap items-baseline gap-1 break-words">
        {personValues.displayParts.slice(0, -1).map((part, index) => (
          <React.Fragment key={index}>{part}, </React.Fragment>
        ))}
        {/* we want the flag to wrap with the country so it doesn't look odd 
        when there's a line break only for the flag*/}
        <span className="whitespace-nowrap flex flex-row gap-1.5">
          {personValues.displayParts[personValues.displayParts.length - 1]}
          {personValues.countryCodes && (
            <>
              <CountryFlags
                countryCodes={personValues.countryCodes}
                className="inline-flex pt-0 self-start"
              />
            </>
          )}
        </span>
      </span>
    </span>
  );
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
