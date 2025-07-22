import { CountryCode } from '../../../shared/types/countries';
import { routerPaths } from './url-helper';

//To build our search queries in an easy chain-like way (…byTerm(…).byGenres(…).toString(…))
//undefined params are skipped so we can use the chain completely adapting to user filters
//toString() must be called to end the chain with the valid url!

type SearchType = 'show' | 'film' | 'person';
type OrderByType = 'popularity' | 'title' | 'year';
type SortByType = 'desc' | 'asc';

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
  byType(value?: SearchType[]) {
    return this.addParams(value, 'm');
  }
  byCountry(value?: CountryCode) {
    return this.addParam(value, 'c');
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
