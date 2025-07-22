import { useMemo } from 'react';
import Country, { CountryCode } from '../../../../shared/types/countries';
import { MediaType } from '../../../../shared/types/media';
import { FLAG_URL } from '../../constants/url-constants';
import { MediaTypeProps } from '../../types/common-props-types';
import SearchUrlBuilder from '../../utils/search-url-builder';
import { Link } from 'react-router-dom';
import LazyImage, { ImageVariant } from '../common/LazyImage';

interface CountryFlagsProps extends MediaTypeProps {
  countryCodes: CountryCode[];
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

const CountryFlags = ({ countryCodes, mediaType }: CountryFlagsProps) => {
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
    <span className="inline-flex items-center gap-1 pt-1">
      {showCountries.map((c: CountryValues) => (
        <Link key={c.name} to={c.searchUrl}>
          <LazyImage
            src={c.image}
            alt={`${c.name} flag`}
            title={c.name}
            variant={ImageVariant.inline}
            className="w-6 h-4 ring-1 ring-gray-300 shadow-xs"
          />
        </Link>
      ))}
    </span>
  );
};

export default CountryFlags;
