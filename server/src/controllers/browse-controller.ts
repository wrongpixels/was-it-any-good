import express, { Router } from 'express';
import { IndexMediaResults } from '../../../shared/types/models';
import { Film, IndexMedia, Show } from '../models';
import { FindOptions, Op } from 'sequelize';
import { MediaType } from '../../../shared/types/media';
import { SearchType } from '../../../shared/types/search';
import { buildIncludeOptions } from '../services/browse-service';
import { toPlainArray } from '../util/model-helpers';
import { EMPTY_RESULTS } from '../constants/search-browse-constants';
import { PAGE_LENGTH } from '../../../shared/types/search-browse';
import { extractURLParams } from '../util/url-param-extractor';

const router: Router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    //we extract the queries we received and the prebuilt options
    const {
      searchType,
      searchPage,
      isMulti,
      genres,
      where,
      findAndCountOptions,
    } = extractURLParams(req);

    if (isMulti) {
      //if is multi search, we filter Films and Shows directly, gather their indexIds, and finally
      //get the full IndexMedia entries from them applying proper limit, order and pagination
      //this is not ideal, but sequelize has many limitations when filtering nested 'includes' and/or
      //combining tables, so this was the most readable, reliable and manageable approach using ORM.

      const filmFindOptions: FindOptions<Film> = {
        //we just need the indexId, so raw + attribute to make the operation as lightweight as possible
        raw: true,
        attributes: ['indexId'],

        where,
        include: buildIncludeOptions(genres, MediaType.Film, true),
      };
      const showFindOptions: FindOptions = {
        ...filmFindOptions,
        include: buildIncludeOptions(genres, MediaType.Show, true),
      };

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
          //we still need the film/show ids, rating and genres for the frontend
          {
            association: 'film',
            attributes: ['id', 'rating'],
            include: buildIncludeOptions(undefined, MediaType.Film),
          },
          {
            association: 'show',
            attributes: ['id', 'rating'],
            include: buildIncludeOptions(undefined, MediaType.Show),
          },
        ],
      });
      const response: IndexMediaResults = {
        page: searchPage,
        totalResults: count,
        //we consider no results a blank page 1
        totalPages: Math.ceil(count / PAGE_LENGTH) || 1,
        indexMedia: toPlainArray(rows),
      };
      res.json(response);
    } else {
      //if it's a single type query, things are way more straightforward:
      const isFilm: boolean = searchType === SearchType.Film;
      const { count, rows } = await IndexMedia.findAndCountAll({
        ...findAndCountOptions,
        where: { addedToMedia: true },
        include: [
          {
            association: isFilm ? 'film' : 'show',
            attributes: ['id', 'rating'],
            required: true,
            where,
            include: buildIncludeOptions(
              genres,
              isFilm ? MediaType.Film : MediaType.Show
            ),
          },
        ],
      });

      const response: IndexMediaResults = {
        page: searchPage,
        totalResults: count,
        //we consider no results a blank page #1
        totalPages: Math.ceil(count / PAGE_LENGTH) || 1,
        indexMedia: toPlainArray(rows),
      };
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
