import { PropsWithChildren, useMemo } from 'react';
import Country, {
  CountryCode,
  CountryValues,
} from '../../../../../shared/types/countries';
import { MediaType } from '../../../../../shared/types/media';
import { FLAG_URL } from '../../../constants/url-constants';
import { MediaTypeProps } from '../../../types/common-props-types';
import UrlQueryBuilder from '../../../utils/url-query-builder';
import { Link } from 'react-router-dom';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import { routerPaths } from '../../../utils/url-helper';
import CountryFlag from '../../Common/CountryFlags';

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

const buildCountries = (
  codes: CountryCode[],
  mediaType?: MediaType
): CountryValues[] => {
  const urlBuilder: UrlQueryBuilder = new UrlQueryBuilder();
  const countries: CountryValues[] = [];
  codes.forEach((c: CountryCode) => {
    if (c !== 'UNKNOWN') {
      countries.push({
        name: Country[c],
        code: c,
        image: `${FLAG_URL}/${c.toLowerCase()}.png`,
        searchUrl: routerPaths.browse.byQuery(
          urlBuilder.byCountry(c).byMediaType(mediaType).toString()
        ),
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
          <CountryFlag country={c} useLink={useLink} />
        </CountryFlagWrapper>
      ))}
    </span>
  );
};

export default CountryFlags;
