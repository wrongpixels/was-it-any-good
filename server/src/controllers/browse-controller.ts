import express, { Router } from 'express';
import { extractQuery } from '../util/search-helpers';
import { IndexMediaData } from '../../../shared/types/models';
import { Film, IndexMedia, Show } from '../models';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';
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

//single endpoint to handle all filtering options. Only internal data, TMDB is not involved.
//IndexMedia is used instead of Show/Film, as every media entry has a an associated IndexMedia
//Combined mixed searches of Shows and Films has been discarded for being less flexible

interface BrowseResponse {
  totalFilmResults: number;
  totalShowResults: number;
  page: number;
  showResults?: IndexMediaData[];
  filmResults?: IndexMediaData[];
}

router.get('/', async (req, res, next) => {
  try {
    //search options
    const searchType: SearchType =
      arrayToSearchType(extractQuery(req.query.m)) ?? SearchType.Multi;
    const isMulti: boolean = searchType === SearchType.Multi;
    const searchPage: number = Number(req.query.page) || 1;

    //filters
    const genres: string[] = extractQuery(req.query.g);
    const countries: CountryCode[] = validateCountries(
      extractQuery(req.query.c)
    ).filter((c: CountryCode) => c !== 'UNKNOWN');
    const year: string | undefined = req.query.y?.toString();

    //order (popularity DESC by default)
    const orderBy: OrderBy =
      stringToOrderBy(req.query.orderBy?.toString()) || OrderBy.Popularity;
    const sort: Sorting =
      stringToSorting(req.query.sort?.toString()) || Sorting.descending;

    //the where options for Film and Show found in IndexMedia
    const whereOptions: WhereOptions<Show | Film> = {};

    if (year) {
      console.log(year);
      whereOptions.releaseDate = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      };
    }
    if (countries.length > 0) {
      console.log(countries);
      whereOptions.country = {
        [Op.overlap]: countries,
      };
    }
    const browseFilms: boolean = searchType === SearchType.Film || isMulti;
    const browseShows: boolean = searchType === SearchType.Show || isMulti;

    //20 results or 2x 10 of each.
    const limit: number = isMulti ? 10 : 20;

    //Enum values already match the expected array element names
    const mainFindOptions: FindAndCountOptions = {
      order: [[orderBy, sort]],
      distinct: true,
      limit,
      offset: limit * (searchPage - 1),
    };

    const [filmMatches, showMatches] = await Promise.all([
      browseFilms
        ? IndexMedia.findAndCountAll({
            ...mainFindOptions,
            where: { addedToMedia: true },
            include: [
              {
                association: 'film',
                required: true,
                where: whereOptions,
                include: buildIncludeOptions(genres, MediaType.Film),
              },
            ],
          })
        : Promise.resolve({ count: 0, rows: [] }),
      browseShows
        ? IndexMedia.findAndCountAll({
            ...mainFindOptions,
            where: { addedToMedia: true },
            include: [
              {
                association: 'show',
                required: true,
                where: whereOptions,
                include: buildIncludeOptions(genres, MediaType.Show),
              },
            ],
          })
        : Promise.resolve({ count: 0, rows: [] }),
    ]);

    const matches: BrowseResponse = {
      page: searchPage,
      totalFilmResults: filmMatches.count,
      totalShowResults: showMatches.count,
      filmResults: toPlainArray(filmMatches.rows) || undefined,
      showResults: toPlainArray(showMatches.rows) || undefined,
    };
    res.json(matches);
  } catch (error) {
    next(error);
  }
});

export default router;

//we decide which tables to search with the same filters and then combine
//the results in a single MediaResponse

/*
    const browseFilms: boolean =
      searchType === SearchType.Film || searchType === SearchType.Multi;
    const browseShows: boolean =
      searchType === SearchType.Show || searchType === SearchType.Multi;

    const [filmMatches, showMatches] = await Promise.all([
      browseFilms
        ? Film.findAndCountAll({
            ...findOptions,
            include: buildIncludeOptions(genres, MediaType.Film),
          })
        : Promise.resolve({ count: 0, rows: [] }),
      browseShows
        ? Show.findAndCountAll({
            ...findOptions,
            include: buildIncludeOptions(genres, MediaType.Show),
          })
        : Promise.resolve({ count: 0, rows: [] }),
    ]);
    const matches: BrowseResponse = {
      page: searchPage,
      totalFilmResults: filmMatches.count,
      totalShowResults: showMatches.count,
      filmResults: toPlainArray(filmMatches.rows) || undefined,
      showResults: toPlainArray(showMatches.rows) || undefined,
    }; */

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
