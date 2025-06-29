import Country, { CountryCode } from '../../../shared/types/countries';
const FLAG_URL = 'https://flagcdn.com/w40';

interface MediaFlagsProps {
  countryCodes: CountryCode[];
}

const MediaFlags = ({ countryCodes: countries }: MediaFlagsProps) => {
  if (!countries) {
    return null;
  }

  const showCountries = countries.slice(0, 3);

  const buildCountry = (c: CountryCode) => {
    if (c === 'UNKNOWN') {
      return null;
    }
    const countryName: string = Country[c];

    return (
      <div key={countryName}>
        <img
          src={`${FLAG_URL}/${c.toLowerCase()}.png`}
          alt={`${c} flag`}
          title={countryName}
          className="w-6 h-4 border border-neutral-200 shadow-xs"
        />
      </div>
    );
  };

  return (
    <div className="inline-flex items-center gap-1 pt-1">
      {showCountries.map((c) => buildCountry(c))}
    </div>
  );
};

export default MediaFlags;
