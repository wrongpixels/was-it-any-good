import express, { Router } from 'express';
import { extractQuery } from '../util/search-helpers';
import { FilmResponse, ShowResponse } from '../../../shared/types/models';
import { Film, Show } from '../models';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { MediaType } from '../../../shared/types/media';
import { CountryCode } from '../../../shared/types/countries';
import { validateCountries } from '../factories/media-factory';
import {
  OrderBy,
  Sorting,
  stringToOrderBy,
  stringToSorting,
} from '../../../shared/types/browse';
import { arrayToSearchType, SearchType } from '../../../shared/types/search';
import { buildIncludeOptions } from '../services/browse-service';
import { toPlainArray } from '../util/model-helpers';

const router: Router = express.Router();

//we use a single endpoint to handle all filtering options
//this router accesses internal data, TMDB is not involved.

interface BrowseResponse {
  totalFilmResults: number;
  totalShowResults: number;
  page: number;
  showResults?: ShowResponse[];
  filmResults?: FilmResponse[];
}

router.get('/', async (req, res, next) => {
  try {
    const searchType: SearchType =
      arrayToSearchType(extractQuery(req.query.m)) ?? SearchType.Multi;
    const searchPage: number = Number(req.query.page) || 1;
    const genres: string[] = extractQuery(req.query.g);

    const countries: CountryCode[] = validateCountries(
      extractQuery(req.query.c)
    ).filter((c: CountryCode) => c !== 'UNKNOWN');

    const year: string | undefined = req.query.y?.toString();
    const orderBy: OrderBy =
      stringToOrderBy(req.query.orderBy?.toString()) || OrderBy.Popularity;
    const sort: Sorting =
      stringToSorting(req.query.sort?.toString()) || Sorting.descending;
    const where: WhereOptions = {};

    if (year) {
      console.log(year);
      where.releaseDate = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      };
    }
    if (countries.length > 0) {
      console.log(countries);
      where.country = {
        [Op.overlap]: countries,
      };
    }
    //to return the result in pages. If multi, que search 10 of each.
    const limit: number = searchType === SearchType.Multi ? 10 : 20;
    const offset: number = limit * (searchPage - 1);

    //we apply all the filters here
    const findOptions: FindOptions = {
      order: [[orderBy, sort]],
      limit,
      where,
      offset,
    };

    //we decide which tables to search with the same filters and then combine
    //the results in a single MediaResponse
    const browseFilms: boolean =
      searchType === SearchType.Film || searchType === SearchType.Multi;
    const browseShows: boolean =
      searchType === SearchType.Show || searchType === SearchType.Multi;

    const [filmMatches, showMatches]: [Film[], Show[]] = await Promise.all([
      browseFilms
        ? Film.findAll({
            ...findOptions,
            include: buildIncludeOptions(genres, MediaType.Film),
          })
        : [],
      browseShows
        ? Show.findAll({
            ...findOptions,
            include: buildIncludeOptions(genres, MediaType.Show),
          })
        : [],
    ]);
    const matches: BrowseResponse = {
      page: searchPage,
      totalFilmResults: 0,
      totalShowResults: 0,
      filmResults: toPlainArray(filmMatches) || undefined,
      showResults: toPlainArray(showMatches) || undefined,
    };

    res.json(matches);
  } catch (error) {
    next(error);
  }
});

export default router;

/*
    //If we made a Multi search, we have to reorder manually.
    if (searchType === SearchType.Multi) {
      res.json(
        matches.sort((a: MediaResponse, b: MediaResponse) => {
          switch (orderBy) {
            case OrderBy.Rating:
              return Sorting.descending
                ? b.rating - a.rating
                : a.rating - b.rating;
            case OrderBy.Title:
              return Sorting.descending
                ? b.name.localeCompare(a.name)
                : a.name.localeCompare(b.name);
            default:
              return Sorting.descending
                ? b.popularity - a.popularity
                : a.popularity - b.popularity;
          }
        })
      );
      return;
    } */
