import { JSX, PropsWithChildren } from 'react';
import { CountryCode } from '../../../shared/types/countries';
import MediaFlags from './MediaFlags';
import { getYear } from '../../../shared/helpers/format-helper';

interface TitleProps extends PropsWithChildren {
  title: string;
  originalTitle?: string;
  date: string | null | undefined;
  country: CountryCode[];
}

const Title = ({
  date,
  title,
  country,
  originalTitle,
  children,
}: TitleProps): JSX.Element => {
  return (
    <div>
      <h2 className="border-b border-gray-200 pb-3 mb-2">
        <div className="text-3xl flex items-center gap-2 ">
          <span className="font-bold">{title}</span>
          <span className="text-gray-400 font-regular">{getYear(date)}</span>
          <MediaFlags countryCodes={country} />
        </div>
        {originalTitle && originalTitle !== title && (
          <div className=" text-gray-400 text-sm font-normal italic mt-1">
            "{originalTitle}"
          </div>
        )}
        {children}
      </h2>
    </div>
  );
};

export default Title;
