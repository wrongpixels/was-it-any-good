import { JSX, PropsWithChildren } from 'react';
import { CountryCode } from '../../../shared/types/countries';
import { MediaType } from '../../../shared/types/media';
import { getYear } from '../../../shared/helpers/format-helper';
import CountryFlags from './Media/MediaCountryFlags';

interface EntryTitleProps extends PropsWithChildren {
  title: string | undefined;
  subtitle?: string;
  country?: CountryCode[] | null;
  date?: string | null;
  mediaType?: MediaType;
}

const EntryTitle = ({
  title,
  subtitle,
  country,
  date,
  mediaType,
  children,
}: EntryTitleProps): JSX.Element | null => {
  return (
    <>
      <div className="border-b border-gray-200 pb-3 mb-2">
        <h2 className="text-3xl flex items-center gap-2 ">
          <span className="font-bold">{title}</span>
          {date && (
            <span className="text-gray-400 font-regular">{getYear(date)}</span>
          )}
          {country && (
            <CountryFlags countryCodes={country} mediaType={mediaType} />
          )}
        </h2>
        {subtitle && subtitle !== title && (
          <h3 className=" text-gray-400 text-sm font-normal italic mt-1">
            "{subtitle}"
          </h3>
        )}
        {children}
      </div>
    </>
  );
};

export default EntryTitle;
