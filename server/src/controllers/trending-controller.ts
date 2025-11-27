import express, { Request, Router } from 'express';
import { createIndexForFilmBulk } from '../factories/film-factory';
import { createIndexForShowBulk } from '../factories/show-factory';

import {
  CreateIndexMedia,
  IndexMediaData,
  IndexMediaResults,
} from '../../../shared/types/models';
import { IndexMedia } from '../models';
import {
  TMDBIndexFilm,
  TMDBIndexShow,
} from '../schemas/tmdb-index-media-schemas';
import { toPlainArray } from '../util/model-helpers';
import { Transaction } from 'sequelize';
import { fetchTrendingFromTMDBAndParse } from '../services/trending-service';
import { useCache } from '../middleware/redis-cache';
import { setActiveCache } from '../util/redis-helpers';
import { UPARAM_PAGE } from '../../../shared/constants/url-param-constants';
import {
  buildIndexMediaInclude,
  bulkUpsertIndexMedia,
} from '../services/index-media-service';
import { sequelize } from '../util/db/initialize-db';
import CustomError from '../util/customError';
import { populateIndexMediaWatchlist } from '../services/user-media-lists-service';

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
    let transaction: Transaction | null = null;

    try {
      const t0 = Date.now();
      console.log('Home request received. Calling TMDB.');

      const page: number = Math.max(
        1,
        Math.min(Number(req.query[UPARAM_PAGE]) || 1, 2)
      );

      const [trendingFilms, trendingShows] =
        await fetchTrendingFromTMDBAndParse();
      const t1 = Date.now();
      console.log('TMDB replied.', `Took ${t1 - t0}ms`, 'Processing data.');

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
      const films: TMDBIndexFilm[] = trendingSlice.filter(
        (item): item is TMDBIndexFilm => 'title' in item
      );
      const shows: TMDBIndexShow[] = trendingSlice.filter(
        (item): item is TMDBIndexShow => 'name' in item
      );

      const indexMedia: CreateIndexMedia[] = [
        ...createIndexForFilmBulk(films),
        ...createIndexForShowBulk(shows),
      ];

      transaction = await sequelize.transaction();

      //our custom bulk create IndexMedia creates or updates the entries and then populates them
      //with the include we provided to add the associations
      const populatedEntries: IndexMedia[] = await bulkUpsertIndexMedia({
        indexMedia,
        transaction,
        include: buildIndexMediaInclude(req.activeUser),
      });
      //we populate the watchlist info of the results this way, as sequelize
      //breaks when nesting the 3 layers of 'includes' that we need!
      const finalIndexMedia: IndexMediaData[] =
        await populateIndexMediaWatchlist(
          toPlainArray(populatedEntries),
          req.activeUser?.id
        );
      await transaction.commit();

      //we build our custom results object for the frontend, limited to
      //2 pages
      const results: IndexMediaResults = {
        indexMedia: finalIndexMedia,
        //we consider no results a blank page 1
        totalPages: combined.length > 21 ? 2 : 1,
        page,
        totalResults: combined.length,
        resultsType: 'browse',
      };
      const t2 = Date.now();
      console.log('Data ready.', `Took ${t2 - t1}ms`, 'Responding to client.');
      res.status(200).json(results);
      setActiveCache(req, results);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      if (!(error instanceof Error)) {
        next(new CustomError('Error updating IndexMedia', 400, 'DB_ERROR'));
      } else {
        next(error);
      }
    }
  }
);

export default router;
