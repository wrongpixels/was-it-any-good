import { OrderBy, Sorting } from '../../../shared/types/browse';
import { CountryCode } from '../../../shared/types/countries';
import { MediaType } from '../../../shared/types/media';
import {
  isValidSearchType,
  mediaTypesToSearchTypes,
  mediaTypeToSearchType,
} from '../../../shared/types/search';

class SearchUrlBuilder {
  private params: Array<[string, string]>;

  constructor() {
    this.params = [];
  }

  private addParam(
    param: string | number | null | undefined,
    key: string,
    append: boolean = false
  ): this {
    if (param !== null && param !== undefined && param !== '') {
      const paramStr = param.toString();
      if (key === 'm') {
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
    return this.addParam(value, 'q');
  }

  byType(value?: string) {
    return this.addParam(value, 'm');
  }

  toPage(value: number | string = 1) {
    console.log('value is', value);
    const numValue: number = Number(value);
    if (!numValue || numValue < 1 || Number.isNaN(numValue)) {
      return this;
    }
    return this.addParam(Math.min(numValue, 500), 'page');
  }

  byTypes(value?: string[]) {
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

  orderBy(value?: OrderBy) {
    return this.addParam(value, 'order');
  }

  sortBy(value?: Sorting) {
    return this.addParam(value, 'sort');
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

export default SearchUrlBuilder;
