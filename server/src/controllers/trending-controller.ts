import express, { Request, Router } from 'express';
import { createIndexForFilmBulk } from '../factories/film-factory';
import { createIndexForShowBulk } from '../factories/show-factory';

import {
  CreateIndexMedia,
  IndexMediaResults,
} from '../../../shared/types/models';
import { IndexMedia } from '../models';
import {
  TMDBIndexFilm,
  TMDBIndexShow,
} from '../schemas/tmdb-index-media-schemas';
import { toPlainArray } from '../util/model-helpers';
import { Op } from 'sequelize';
import { fetchTrendingFromTMDBAndParse } from '../services/trending-service';
import { useCache } from '../middleware/redis-cache';
import { setActiveCache } from '../util/redis-helpers';
import { UPARAM_PAGE } from '../../../shared/constants/url-param-constants';

const router: Router = express.Router();

//this endpoint fetches the current trending films and shows from TMDB.
//we use this as a way of showing current popular media when opening the webpage.

//we don't use standard 'trending/all' for several reasons:
//1 - It combines films with shows, but also people, complicating our sorting and
//providing unbalanced results (we may get 15 films and 5 shows out of 20)
//2 - We ideally need 21 results for our client's initial presentation, but a TMDB call
//returns fixed 20. As we'd need 2 calls either way, we fetch trending shows and films
//separately to then combine them, sorting by popularity (a different metric). This provides
//a balanced amount of trending and relevant Shows and Films.

router.get(
  '/',
  useCache<IndexMediaResults>({ baseKey: 'trending', addQueries: true }),
  async (req: Request, res, next) => {
    try {
      let films: TMDBIndexFilm[] = [];
      let shows: TMDBIndexShow[] = [];

      //'page' can be 1 or 2
      const page: number = Math.max(
        1,
        Math.min(Number(req.query[UPARAM_PAGE]) || 1, 2)
      );

      const [trendingFilms, trendingShows] =
        await fetchTrendingFromTMDBAndParse();

      if (!trendingFilms || !trendingShows) {
        res.json(null);
        return;
      }

      //we combine and sort by popularity the 20 films and 20 shows we received.
      const combined: (TMDBIndexFilm | TMDBIndexShow)[] = [
        ...trendingFilms.films,
        ...trendingShows.shows,
      ].sort((a, b) => b.popularity - a.popularity);

      //from that combined list of 40, we take the slice we want according to the 'page'.
      //if '1', we return the top 21 trending media of the moment and sort it by popularity.
      //if '2', we return the next 18 results (totalling 39), to keep our x3 rows for the client
      const trendingSlice: (TMDBIndexFilm | TMDBIndexShow)[] =
        page === 1 ? combined.slice(0, 21) : combined.slice(21, 39);

      //we filter the results back into their respective types for processing.
      films = trendingSlice.filter(
        (item): item is TMDBIndexFilm => 'title' in item
      );
      shows = trendingSlice.filter(
        (item): item is TMDBIndexShow => 'name' in item
      );

      const indexMedia: CreateIndexMedia[] = [
        ...createIndexForFilmBulk(films),
        ...createIndexForShowBulk(shows),
      ];

      //we bulk create or update if existing, returning so we know the involved ids
      const entries: IndexMedia[] = await IndexMedia.bulkCreate(indexMedia, {
        updateOnDuplicate: ['popularity', 'image', 'baseRating'],
        returning: true,
      });

      const ids = entries.map((i: IndexMedia) => i.id);

      //we find them again to get the show/film ids and the genres of the
      //IndexMedia entries of media already in our db.
      const populatedEntries: IndexMedia[] = await IndexMedia.scope(
        'withMediaAndGenres'
      ).findAll({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      });

      //we build our custom results object for the frontend, limited to
      //2 pages
      const results: IndexMediaResults = {
        indexMedia: toPlainArray(populatedEntries),
        //we consider no results a blank page 1
        totalPages: combined.length > 21 ? 2 : 1,
        page,
        totalResults: combined.length,
        resultsType: 'browse',
      };
      res.json(results);
      setActiveCache(req, results);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
