import { PropsWithChildren, useMemo } from 'react';
import Country, { CountryCode } from '../../../../shared/types/countries';
import { MediaType } from '../../../../shared/types/media';
import { FLAG_URL } from '../../constants/url-constants';
import {
  MediaTypeProps,
  OptClassNameProps,
} from '../../types/common-props-types';
import SearchUrlBuilder from '../../utils/search-url-builder';
import { Link } from 'react-router-dom';
import LazyImage, { ImageVariant } from '../common/LazyImage';
import { styles } from '../../constants/tailwind-styles';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface CountryFlagWrapperProps extends PropsWithChildren {
  to: string;
  useLink: boolean;
}

//a wrapper to avoid rendering Links inside Links when needed (as in Search Cards)
const CountryFlagWrapper: React.FC<CountryFlagWrapperProps> = ({
  to,
  children,
  useLink,
}) => {
  if (useLink) {
    return <Link to={to}>{children}</Link>;
  }
  return <span>{children}</span>;
};

interface CountryFlagsProps extends MediaTypeProps {
  countryCodes: CountryCode[];
  useLink?: boolean;
}

interface CountryFlagIconProps extends OptClassNameProps {
  country: CountryValues;
  useLink?: boolean;
}

interface CountryValues {
  name: string;
  image: string;
  searchUrl: string;
}

const buildCountries = (
  codes: CountryCode[],
  mediaType?: MediaType
): CountryValues[] => {
  const search: SearchUrlBuilder = new SearchUrlBuilder();
  const countries: CountryValues[] = [];
  codes.forEach((c: CountryCode) => {
    if (c !== 'UNKNOWN') {
      countries.push({
        name: Country[c],
        image: `${FLAG_URL}/${c.toLowerCase()}.png`,
        searchUrl: search.byCountry(c).byMediaType(mediaType).toString(),
      });
    }
  });
  return countries;
};

const CountryFlags = ({
  countryCodes,
  useLink = true,
  mediaType,
  className,
}: CountryFlagsProps) => {
  if (!countryCodes) {
    return null;
  }
  const showCountries: CountryValues[] = useMemo(
    () => buildCountries(countryCodes.slice(0, 3), mediaType),
    [countryCodes, mediaType]
  );

  if (showCountries.length < 1) {
    return null;
  }

  return (
    <span
      className={mergeClassnames(
        'inline-flex items-center gap-2 pt-1',
        className
      )}
    >
      {showCountries.map((c: CountryValues) => (
        <CountryFlagWrapper key={c.name} to={c.searchUrl} useLink={useLink}>
          <CountryFlagIcon country={c} useLink={useLink} />
        </CountryFlagWrapper>
      ))}
    </span>
  );
};

const CountryFlagIcon = ({ country, useLink }: CountryFlagIconProps) => (
  <LazyImage
    src={country.image}
    alt={`${country.name} flag`}
    title={country.name}
    variant={ImageVariant.inline}
    className={`w-6 h-4 ring-1 ring-gray-300 shadow-xs ${useLink ? styles.animations.zoomOnHover : ''}`}
  />
);

export default CountryFlags;
