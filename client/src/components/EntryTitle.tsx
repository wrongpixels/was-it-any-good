import { JSX, PropsWithChildren } from 'react';
import { CountryCode } from '../../../shared/types/countries';
import { MediaType } from '../../../shared/types/media';
import { getYearParenthesis } from '../../../shared/helpers/format-helper';
import CountryFlags from './Media/MediaCountryFlags';
import Separator from './common/Separator';

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
      <div className="pb-3 mb-1 min-h-15 flex flex-col">
        <h2 className="text-3xl">
          {icon && (
            <span className="inline-block align-middle mr-2">{icon}</span>
          )}

          <span className="font-bold align-middle">{title}</span>

          <span className="font-normal text-gray-400 align-middle">
            {date && ` ${getYearParenthesis(date)}`}
          </span>

          {country && (
            <span className="inline-block align-middle ml-1">
              <CountryFlags countryCodes={country} mediaType={mediaType} />
            </span>
          )}
        </h2>

        {subtitle && subtitle !== title && (
          <h3 className="text-gray-400 text-sm font-normal italic mt-1">
            "{subtitle}"
          </h3>
        )}
        {children}
        <Separator />
      </div>
    </>
  );
};

export default EntryTitle;
