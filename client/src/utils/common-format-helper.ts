import Country, { CountryCode } from '../../../shared/types/countries';

export const capitalize = (value: string): string =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

export const joinWithAnd = (arr: string[]): string => {
  if (arr.length === 0) {
    return '';
  }
  if (arr.length === 1) {
    return arr[0];
  }
  if (arr.length === 2) {
    return arr.join(' and ');
  }
  return `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`;
};

interface BrowseTitleParameters {
  searchTerm?: string | null;
  queryType?: string[];
  genres?: string[];
  countries?: CountryCode[];
  year?: string | null;
}

export const getBrowseOperation = (params: BrowseTitleParameters): string => {
  const {
    searchTerm = null,
    queryType = [],
    genres = [],
    countries = [],
    year = null,
  } = params;

  const mediaString =
    queryType.length !== 1 ? 'Media' : `${capitalize(queryType[0])}s`;

  const activeFilters: string[] = [];
  if (genres.length > 0) {
    activeFilters.push(genres.length > 1 ? 'Genres' : 'Genre');
  }

  if (year) {
    activeFilters.push('Year');
  }

  const titleParts: string[] = [`Browsing ${mediaString}`];

  if (searchTerm) {
    titleParts.push(`for "${searchTerm}"`);
  }

  if (countries.length > 0) {
    titleParts.push(
      `from ${countries.map((c: CountryCode) => Country[c]).join(' or ')}`
    );
  }

  if (activeFilters.length > 0) {
    const filterString = joinWithAnd(activeFilters);
    titleParts.push(`by ${filterString}`);
  }

  return titleParts.join(' ');
};
