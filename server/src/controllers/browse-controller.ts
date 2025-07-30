import express, { Router } from 'express';
import { extractQuery } from '../util/search-helpers';
import { IndexMediaResponse } from '../../../shared/types/models';
import { Film, IndexMedia, Show } from '../models';
import { FindAndCountOptions, FindOptions, Op, WhereOptions } from 'sequelize';
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
import { EMPTY_RESULTS } from '../constants/search-browse-constants';
import { PAGE_LENGTH } from '../../../shared/types/search-browse';

const router: Router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const searchType: SearchType =
      arrayToSearchType(extractQuery(req.query.m)) ?? SearchType.Multi;
    const isMulti: boolean = searchType === SearchType.Multi;
    const searchPage: number = Number(req.query.page) || 1;
    const genres: string[] = extractQuery(req.query.g);
    const countries: CountryCode[] = validateCountries(
      extractQuery(req.query.c)
    ).filter((c: CountryCode) => c !== 'UNKNOWN');
    const year: string | undefined = req.query.y?.toString();
    const orderBy: OrderBy =
      stringToOrderBy(req.query.orderby?.toString()) || OrderBy.Popularity;
    const sort: Sorting =
      stringToSorting(req.query.sort?.toString().toUpperCase()) ||
      Sorting.descending;

    //shared filters for years and countries
    const whereOptions: WhereOptions = {};
    if (year) {
      whereOptions.releaseDate = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
      };
      console.log(year);
    }
    if (countries.length > 0) {
      whereOptions.country = { [Op.overlap]: countries };
    }
    //pagination values
    const findAndCountOptions: FindAndCountOptions = {
      order: [[orderBy, sort]],
      distinct: true,
      limit: PAGE_LENGTH,
      offset: PAGE_LENGTH * (searchPage - 1),
    };

    const filmFindOptions: FindOptions<Film> = {
      //we just need the indexId, so raw + attribute to make the operation as lightweight as possible
      raw: true,
      attributes: ['indexId'],

      where: whereOptions,
      include: buildIncludeOptions(genres, MediaType.Film),
    };
    const showFindOptions: FindOptions = {
      ...filmFindOptions,
      include: buildIncludeOptions(genres, MediaType.Show),
    };

    if (isMulti) {
      //if is multi search, we filter Films and Shows directly, gather their indexIds, and finally we'll
      //get the full IndexMedia entries from them applying proper limit, order and pagination
      //this is not ideal, but sequelize has many inconsistencies and limitations when filtering nested 'includes' and
      //combining tables, so this was the most readable, reliable and manageable approach using ORM.
      const [filmIndexIds, showIndexIds] = await Promise.all([
        //we get the indexId of Films and Shows matching the filters.
        Film.findAll(filmFindOptions),
        Show.findAll(showFindOptions),
      ]);

      //we now combine their indexIds into a single array
      const matchingIndexIds = [
        ...filmIndexIds.map((f) => f.indexId),
        ...showIndexIds.map((s) => s.indexId),
      ];

      //if no matches, we stop here
      if (matchingIndexIds.length === 0) {
        res.json(EMPTY_RESULTS);
        return;
      }
      //we get our full IndexMedia entries by ids, applying limit, order and pagination safely
      const { count, rows } = await IndexMedia.findAndCountAll({
        where: {
          id: { [Op.in]: matchingIndexIds },
          addedToMedia: true,
        },
        ...findAndCountOptions,
        include: [
          //we still need the film/show ids for the frontend
          { association: 'film', attributes: ['id'] },
          { association: 'show', attributes: ['id'] },
        ],
      });
      const response: IndexMediaResponse = {
        page: searchPage,
        totalResults: count,
        totalPages: Math.ceil(count / PAGE_LENGTH),
        indexMedia: toPlainArray(rows),
      };
      res.json(response);
    } else {
      //if it's a single type query, we things are way more straightforward:
      const isFilm: boolean = searchType === SearchType.Film;
      const { count, rows } = await IndexMedia.findAndCountAll({
        ...findAndCountOptions,
        where: { addedToMedia: true },
        include: [
          {
            association: isFilm ? 'film' : 'show',
            attributes: ['id'],
            required: true,
            where: whereOptions,
            include: buildIncludeOptions(
              genres,
              isFilm ? MediaType.Film : MediaType.Show
            ),
          },
        ],
      });

      const response: IndexMediaResponse = {
        page: searchPage,
        totalResults: count,
        totalPages: Math.ceil(count / PAGE_LENGTH),
        indexMedia: toPlainArray(rows),
      };
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
