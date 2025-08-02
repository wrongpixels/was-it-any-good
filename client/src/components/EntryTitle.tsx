import { JSX, PropsWithChildren } from 'react';
import { CountryCode } from '../../../shared/types/countries';
import { MediaType } from '../../../shared/types/media';
import { getYearParenthesis } from '../../../shared/helpers/format-helper';
import CountryFlags from './Media/MediaCountryFlags';

export interface EntryTitleProps extends PropsWithChildren {
  title?: string | undefined;
  subtitle?: string;
  country?: CountryCode[] | null;
  icon?: JSX.Element;
  date?: string | null;
  mediaType?: MediaType;
}

const EntryTitle = ({
  title,
  subtitle,
  country,
  icon,
  date,
  mediaType,
  children,
}: EntryTitleProps): JSX.Element | null => {
  return (
    <>
      <div className="border-b border-gray-200 pb-3 mb-2 min-h-15">
        <h2 className="text-3xl">
          <span className="inline-flex flex-wrap items-center gap-2 align-middle justify-center">
            {icon && icon}
            <span className="font-bold">{title}</span>
            <span className="text-gray-400 font-regular">
              {date && getYearParenthesis(date)}
            </span>
            {country && (
              <CountryFlags countryCodes={country} mediaType={mediaType} />
            )}
          </span>
        </h2>
        {subtitle && subtitle !== title && (
          <h3 className="text-gray-400 text-sm font-normal italic mt-1">
            "{subtitle}"
          </h3>
        )}
        {children}
      </div>
    </>
  );
};

export default EntryTitle;
