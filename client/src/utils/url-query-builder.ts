import { SortBy, SortDir } from '../../../shared/types/browse';
import { MediaType } from '../../../shared/types/media';
import {
  isValidSearchType,
  mediaTypesToSearchTypes,
  mediaTypeToSearchType,
  SearchType,
} from '../../../shared/types/search';
import {
  DEF_SEARCH_TYPE,
  DEF_SORT_BY,
  DEF_SORT_DIR,
  UPARAM_COUNTRIES,
  UPARAM_GENRES,
  UPARAM_PAGE,
  UPARAM_QUERY_TYPE,
  UPARAM_SEARCH_TERM,
  UPARAM_SORT_BY,
  UPARAM_SORT_DIR,
  UPARAM_YEAR,
} from '../../../shared/constants/url-param-constants';

class UrlQueryBuilder {
  private params: Array<[string, string]>;
  private defSortBy: SortBy;
  private defSortDir: SortDir;
  private defSearchType: SearchType;

  constructor() {
    this.params = [];
    this.defSortBy = DEF_SORT_BY;
    this.defSortDir = DEF_SORT_DIR;
    this.defSearchType = DEF_SEARCH_TYPE;
    //  console.log(overrideParams?.searchType);
  }
  //we need to call this before every new construction to ensure
  //we are not reusing previous ones
  clean(): this {
    this.params.length = 0;
    return this;
  }

  private deleteParamByKey(key: string) {
    this.params = this.params.filter(([k]) => k !== key);
  }

  private addParam(
    param: string | number | null | undefined,
    key: string,
    append: boolean = false
  ): this {
    if (param !== null && param !== undefined && param !== '') {
      const paramStr = param.toString();
      if (key === UPARAM_QUERY_TYPE) {
        if (!isValidSearchType(paramStr)) {
          return this;
        }
      }
      if (!append) {
        this.params = this.params.filter(([k]) => k !== key);
      }
      this.params.push([key, paramStr]);
    }
    return this;
  }

  private addParams(
    params: (string | number | null)[] | undefined,
    key: string
  ): this {
    if (params) {
      this.params = this.params.filter(([k]) => k !== key);
      params.forEach((p) => {
        if (p !== null && p !== undefined && p !== '') {
          this.addParam(p, key, true);
        }
      });
    }
    return this;
  }

  byTerm(value: string | number | null) {
    return this.addParam(value, UPARAM_SEARCH_TERM);
  }

  byType(value?: string) {
    if (value) {
      this.deleteParamByKey(UPARAM_QUERY_TYPE);
    }
    return value === this.defSearchType
      ? this
      : this.addParam(value, UPARAM_QUERY_TYPE);
  }

  toPage(value: number | string = 1) {
    console.log('value is', value);
    const numValue: number = Number(value);
    if (!numValue || numValue < 1 || Number.isNaN(numValue)) {
      return this;
    }
    return this.addParam(Math.min(numValue, 500), UPARAM_PAGE);
  }

  byTypes(value?: string[]) {
    return this.addParams(value, UPARAM_QUERY_TYPE);
  }

  byMediaType(value?: MediaType) {
    return this.addParam(mediaTypeToSearchType(value), UPARAM_QUERY_TYPE);
  }

  byMediaTypes(value?: MediaType[]) {
    return this.addParams(mediaTypesToSearchTypes(value), UPARAM_QUERY_TYPE);
  }

  byCountry(value?: string) {
    return this.addParam(value, UPARAM_COUNTRIES);
  }

  byCountries(value?: string[]) {
    return this.addParams(value, UPARAM_COUNTRIES);
  }

  byGenre(value?: number | null) {
    return this.addParam(value, UPARAM_GENRES);
  }

  byGenres(value?: string[]) {
    return this.addParams(value, UPARAM_GENRES);
  }
  byYear(value?: number | string | null) {
    return this.addParam(value, UPARAM_YEAR);
  }
  sortBy(value?: SortBy) {
    return value === this.defSortBy
      ? this
      : this.addParam(value, UPARAM_SORT_BY);
  }

  sortDir(value?: SortDir) {
    return value === this.defSortDir
      ? this
      : this.addParam(value, UPARAM_SORT_DIR);
  }

  toString() {
    return this.params
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  }
}

export default UrlQueryBuilder;
