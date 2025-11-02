import { CountryValues } from '../../../../shared/types/countries';
import { mediaPaths } from '../../../../shared/util/url-builder';
import { styles } from '../../constants/tailwind-styles';
import { OptBoolProps } from '../../types/common-props-types';

interface CountryFlagProps extends OptBoolProps {
  country: CountryValues;
  size?: number;
  useLink?: boolean;
}

const CountryFlag = ({
  country,
  useLink,
  size = 16,
  className = '',
}: CountryFlagProps) => {
  const flagHeight = size;
  const flagWidth = Math.round(flagHeight * 1.6);
  const flagUrl = mediaPaths.countries.byCode(country.code);

  return (
    <span
      role="img"
      title={country.name}
      aria-label={`${country.name} flag`}
      className={`inline-block relative align-middle rounded-xs ring-gray-300 drop-shadow-xs/40 ${className} ${
        useLink ? styles.animations.zoomOnHover : ''
      }`}
      style={{
        width: `${flagWidth}px`,
        height: `${flagHeight}px`,
        backgroundImage: `url(${flagUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        top: '-0.16em',
      }}
    />
  );
};

export default CountryFlag;
