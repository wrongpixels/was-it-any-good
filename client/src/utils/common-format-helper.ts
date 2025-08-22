import Country, { CountryCode } from '../../../shared/types/countries';
import { GenreResponse } from '../../../shared/types/models';
import { URLParameters } from '../types/search-browse-types';

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
  urlParams: URLParameters;
  genreResults: GenreResponse[];
}

export const getBrowseOperation = ({
  urlParams,
  genreResults,
}: BrowseTitleParameters): string => {
  const {
    searchTerm = null,
    queryType = [],
    countries = [],
    year = null,
  } = urlParams;

  const mediaString =
    queryType.length !== 1 ? 'Media' : `${capitalize(queryType[0])}s`;

  const activeFilters: string[] = [];

  if (year) {
    activeFilters.push('Year');
  }

  const titleParts: string[] = [''];

  if (searchTerm) {
    titleParts.push(`for "${searchTerm}"`);
  }

  if (genreResults.length > 0) {
    titleParts.push(
      `${genreResults.map((g: GenreResponse) => g.name).join(' or ')} ${mediaString}`
    );
  } else {
    titleParts.push(mediaString);
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
