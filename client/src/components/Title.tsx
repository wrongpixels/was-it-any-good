import { JSX } from 'react';
import { CountryCode } from '../../../shared/types/countries';
import MediaFlags from './MediaFlags';
import { getYear } from '../../../shared/src/helpers/format-helper';

interface TitleProps {
  title: string;
  date: string | null | undefined;
  country: CountryCode[];
}

const Title = ({ date, title, country }: TitleProps): JSX.Element => {
  return (
    <div>
      <h2 className="text-3xl flex items-center gap-2 border-b border-gray-200 pb-3 mb-2">
        <span className="font-bold">{title}</span>
        <span className="text-gray-400 font-regular">{getYear(date)}</span>
        <MediaFlags countryCodes={country} />
      </h2>
    </div>
  );
};

export default Title;
