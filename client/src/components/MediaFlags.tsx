import Country, { CountryCode } from "../../../shared/types/countries";
const FLAG_URL = "https://flagcdn.com/w40";

interface MediaFlagsProps {
  countryCodes: CountryCode[];
}

const MediaFlags = ({ countryCodes: countries }: MediaFlagsProps) => {
  if (!countries) return null;

  const showCountries = countries.slice(0, 2);

  const buildCountry = (c: CountryCode) => {
    const countryName: string = Country[c];

    return (
      <div>
        <img
          src={`${FLAG_URL}/${c.toLowerCase()}.png`}
          alt={`${c} flag`}
          title={countryName}
          className="w-6 rounded border border-neutral-300 shadow"
        />
      </div>
    );
  };

  return <>{showCountries.map((c) => buildCountry(c))}</>;
};

export default MediaFlags;
