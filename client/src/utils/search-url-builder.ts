import { CountryCode } from '../../../shared/types/countries';
import { MediaType } from '../../../shared/types/media';
import { routerPaths } from './url-helper';

export const mediaTypesToSearchTypes = (
  mediaTypes: MediaType[] | undefined | null
): (SearchType | null)[] | undefined => {
  if (!mediaTypes) {
    return undefined;
  }
  const searchTypes: SearchType[] = [];
  mediaTypes.forEach((m: MediaType) => {
    const searchType: SearchType | null | undefined = mediaTypeToSearchType(m);
    if (searchType) {
      searchTypes.push(searchType);
    }
  });
  return searchTypes;
};

export const mediaTypeToSearchType = (
  mediaType: MediaType | undefined
): SearchType | null | undefined => {
  switch (mediaType) {
    case MediaType.Film:
      return 'film';
    case MediaType.Show:
      return 'show';
    case MediaType.Season:
      return 'season';
    default:
      return null;
  }
};

export type SearchType = 'show' | 'film' | 'person' | 'season';
type OrderByType = 'popularity' | 'title' | 'year';
type SortByType = 'desc' | 'asc';

//To build our search queries in an easy chain-like way (…byTerm(…).byGenres(…).toString(…))
//undefined params are skipped so we can use the chain completely adapting to user filters
//toString() must be called to end the chain with the valid url!

class SearchUrlBuilder {
  private searchParams: URLSearchParams;
  private basePath: string;

  constructor(path?: string) {
    this.searchParams = new URLSearchParams();
    this.basePath = path ? path : routerPaths.search.base;
  }

  private addParam(
    param: string | number | null | undefined,
    key: string,
    append: boolean = false
  ): this {
    if (param) {
      append
        ? this.searchParams.append(key, param.toString())
        : this.searchParams.set(key, param.toString());
    }
    return this;
  }

  private addParams(
    params: (string | number | null)[] | undefined,
    key: string
  ): this {
    if (params) {
      this.searchParams.delete(key);
      params.forEach((p: string | number | null) => {
        if (p) {
          this.addParam(p, key, true);
        }
      });
    }
    return this;
  }

  byTerm(value: string | number | null) {
    return this.addParam(value, 'q');
  }
  byType(value?: SearchType) {
    return this.addParam(value, 'm');
  }
  byTypes(value?: SearchType[]) {
    return this.addParams(value, 'm');
  }
  byMediaType(value?: MediaType) {
    return this.addParam(mediaTypeToSearchType(value), 'm');
  }
  byMediaTypes(value?: MediaType[]) {
    return this.addParams(mediaTypesToSearchTypes(value), 'm');
  }
  byCountry(value?: CountryCode) {
    return this.addParam(value, 'c');
  }
  byGenre(value?: number) {
    return this.addParam(value, 'g');
  }
  byGenres(value?: string[]) {
    return this.addParams(value, 'g');
  }
  orderBy(value?: OrderByType) {
    return this.addParam(value, 'orderBy');
  }
  sortBy(value?: SortByType) {
    return this.addParam(value, 'sortBy');
  }
  toString() {
    const queryString = this.searchParams.toString();
    return queryString ? `${this.basePath}?${queryString}` : this.basePath;
  }
}

export default SearchUrlBuilder;
