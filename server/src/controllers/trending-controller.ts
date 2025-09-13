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
  TMDBSearchResult,
} from '../schemas/tmdb-index-media-schemas';
import { toPlainArray } from '../util/model-helpers';
import { Op } from 'sequelize';
import { fetchTrendingFromTMDBAndParse } from '../services/trending-service';

const router: Router = express.Router();

//this endpoint fetches the current trending films and shows from TMDB.
//we use this as a way of showing current popular media when opening the webpage.

router.get('/', async (_req: Request, res, next) => {
  try {
    let films: TMDBIndexFilm[] = [];
    let shows: TMDBIndexShow[] = [];
    let searchResult: TMDBSearchResult | null = null;

    //unlike the search controller, we don't need pagination.
    //we list the top 21 trending media items of the moment, combine them and return them.

    const [trendingFilms, trendingShows] =
      await fetchTrendingFromTMDBAndParse();

    if (!trendingFilms || !trendingShows) {
      res.json(null);
      return;
    }

    //we combine and sort by popularity the 20 films and 20 shows we received.
    const combined = [...trendingFilms.films, ...trendingShows.shows].sort(
      (a, b) => b.popularity - a.popularity
    );

    //from that combined list of 40, we take the top 21 results (for our 3x7 grid)
    const topTrending = combined.slice(0, 21);

    //we filter the results back into their respective types for processing.
    films = topTrending.filter(
      (item): item is TMDBIndexFilm => 'title' in item
    );
    shows = topTrending.filter((item): item is TMDBIndexShow => 'name' in item);

    //we build a placeholder result object for the frontend.
    //page and total_pages are always 1, and total_results is the count of our sliced list.
    searchResult = {
      total_results: topTrending.length,
      page: 1,
      results: [],
      total_pages: 1,
    };

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
    const populatedEntries = await IndexMedia.scope(
      'withMediaAndGenres'
    ).findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    const indexMediaResponse: IndexMediaResults = {
      indexMedia: toPlainArray(populatedEntries),
      //we consider no results a blank page 1
      totalPages: searchResult.total_pages || 1,
      page: searchResult.page,
      totalResults: searchResult.total_results,
      resultsType: 'browse',
    };
    res.json(indexMediaResponse);
  } catch (error) {
    next(error);
  }
});

export default router;
