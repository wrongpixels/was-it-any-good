import express, { Router } from 'express';
import { extractQuery } from '../util/search-helpers';
import { MediaResponse } from '../../../shared/types/models';
import { Film, Show } from '../models';
import { FindOptions, IncludeOptions, Op, WhereOptions } from 'sequelize';
import { MediaType } from '../../../shared/types/media';
import { CountryCode } from '../../../shared/types/countries';
import { validateCountries } from '../factories/media-factory';
import {
  arrayToBrowseType,
  BrowseType,
  OrderBy,
  Sorting,
  stringToOrderBy,
  stringToSorting,
} from '../../../shared/types/browse';

const router: Router = express.Router();

//we use a single endpoint to handle all filtering options
//this router accesses internal data, TMDB is not involved.

router.get('/', async (req, res, next) => {
  try {
    const browseType: BrowseType =
      arrayToBrowseType(extractQuery(req.query.m)) ?? BrowseType.Multi;
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
    const include: IncludeOptions[] = [];

    if (genres) {
      console.log(genres);
      const genreInclude: IncludeOptions = {
        association: 'genres',
        required: true,
        attributes: ['id', 'tmdbId'],
        through: {
          attributes: [],
          where: {
            mediaType: MediaType.Film,
            id: {
              [Op.in]: genres,
            },
          },
        },
      };
      include.push(genreInclude);
    }
    if (year) {
      console.log(year);
      where.releaseDate = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      };
    }
    if (countries) {
      console.log(countries);
      where.country = {
        [Op.overlap]: countries,
      };
    }
    //to return the result in pages. If multi, que search 10 of each.
    const limit: number = browseType === BrowseType.Multi ? 10 : 20;
    const offset: number = limit * (searchPage - 1);

    //we apply all the filters here
    const findOptions: FindOptions = {
      raw: true,
      order: [[orderBy, sort]],
      limit,
      include,
      where,
      offset,
    };
    //we decide which tables to search with the same filters and then combine
    //the results in a single MediaResponse
    const browseFilms: boolean =
      browseType === BrowseType.Film || browseType === BrowseType.Multi;
    const browseShows: boolean =
      browseType === BrowseType.Show || browseType === BrowseType.Multi;

    const [filmMatches, showMatches]: [MediaResponse[], MediaResponse[]] =
      await Promise.all([
        browseFilms ? Film.findAll(findOptions) : [],
        browseShows ? Show.findAll(findOptions) : [],
      ]);
    const matches: MediaResponse[] = [...filmMatches, ...showMatches];
    res.json(matches);
  } catch (error) {
    next(error);
  }
});

export default router;
