import express, { Request, Router } from 'express';
import { createIndexForFilmBulk } from '../factories/film-factory';
import { createIndexForShowBulk } from '../factories/show-factory';

import {
  CreateIndexMedia,
  IndexMediaResults,
} from '../../../shared/types/models';
import { arrayToTMDBSearchTypes, extractQuery } from '../util/search-helpers';
import { TMDBSearchType } from '../../../shared/types/search';
import { IndexMedia } from '../models';
import {
  TMDBIndexFilm,
  TMDBIndexShow,
  TMDBSearchResult,
} from '../schemas/tmdb-index-media-schemas';
import { toPlainArray } from '../util/model-helpers';
import { fetchSearchFromTMDBAndParse } from '../services/search-service';
import {
  buildIndexMediaInclude,
  bulkUpsertIndexMedia,
} from '../services/index-media-service';
import { useCache } from '../middleware/redis-cache';
import { EMPTY_RESULTS } from '../constants/search-browse-constants';
import { setActiveCache } from '../util/redis-helpers';
//import { tmdbAPI } from '../util/config';

const router: Router = express.Router();

//we convert our own query style into TMDB's and return the results, adding any
//entry we don't have to out lightweight IndexMedia table, so it can appear in
//suggestions and quick searches without calling TMDB's API

router.get(
  '/',
  useCache<IndexMediaResults>({ baseKey: 'search', addQueries: true }),
  async (req: Request, res, next) => {
    try {
      const searchTerm: string | undefined =
        req.query.q?.toString().trim() || '';
      const searchPage: string = req.query.page?.toString() ?? '1';
      const searchTypeString: string[] = extractQuery(req.query.m);

      const searchType: TMDBSearchType =
        arrayToTMDBSearchTypes(searchTypeString)[0];

      if (!searchTerm) {
        res.json({ error: 'No query!' });
        return;
      }
      const isMulti: boolean = searchType === TMDBSearchType.Multi;
      let films: TMDBIndexFilm[] = [];
      let shows: TMDBIndexShow[] = [];

      const pageNum: number = Number(searchPage) || 1;
      let searchResult: TMDBSearchResult | null = null;

      if (!isMulti) {
        //if singe search, we search by term and page simply assign the parsed results we receive.
        const [indexFilms, indexShows] = await fetchSearchFromTMDBAndParse(
          searchTerm,
          searchType,
          pageNum
        );
        if (indexFilms) {
          films = indexFilms?.films;
          searchResult = indexFilms;
        }
        if (indexShows) {
          shows = indexShows?.shows;
          searchResult = indexShows;
        }
      } else {
        //if it's multi, things get way more complicated.
        //TMDB's multi endpoint includes extra results (like People) that we don't wish to include.
        //it doesn't provide either an endpoint for searching shows and films at the same time.
        //as responses come in fixed pages of 20, we can't fetch all results to sort them ourselves.

        //our solution is to build pairs of pages of 20 films and 20 shows and sort them by popularity.
        //This provides a better-ranked result than just stitching two lists together, but has some
        //tradeoffs, apart from being a bit convoluted.

        //first, we optimistically try combining 20 films and 20 shows at the same page.
        //as we're splitting 2 pairs of 20 results into 2 of 10, we access the target page/2
        //(eg: we want results of 'page 4', but those are pages 2 of show and film [20*2 vs 10*4])

        //if it's a .5 result, we take the next int
        const calculatedPage = Math.ceil(pageNum / 2);

        //we fetch 20 shows and 20 films from the calculatedPage page (eg: page 2)
        const [indexFilms, indexShows] = await fetchSearchFromTMDBAndParse(
          searchTerm,
          searchType,
          calculatedPage
        );
        if (!indexFilms || !indexShows) {
          res.json(null);
          return;
        }
        const filmTotalPages = indexFilms.total_pages;
        const showTotalPages = indexShows.total_pages;
        const filmTotalResults = indexFilms.total_results;
        const showTotalResults = indexShows.total_results;

        //we calculate which list will end sooner. Whenever that happens, we have
        //to move from combining 10 and 10 of each to showing whole 20 of the
        //remaining list.
        const shorterListPages = Math.min(filmTotalPages, showTotalPages);
        const crossoverPage = shorterListPages * 2;
        const totalResults = filmTotalResults + showTotalResults;
        const totalPages = Math.ceil(totalResults / 20);

        //if we're not at that point, we accessed a page with still results of each list,
        //so our optimistic call worked.
        if (pageNum <= crossoverPage) {
          //we combine and sort by popularity the parsed media
          const combined = [...indexFilms.films, ...indexShows.shows].sort(
            (a, b) => b.popularity - a.popularity
          );
          //and we check the page number to know if we requested an odd or an even page.
          //as we're dealing with 40 results, we return the first 20 results to 'page 1', and the
          //second 20 to 'page 2', but they all come from page 1 of individual film and show searches.
          const isOddPage = pageNum % 2 !== 0;
          const paginated = isOddPage
            ? combined.slice(0, 20)
            : combined.slice(20, 40);

          films = paginated.filter(
            (item): item is TMDBIndexFilm => 'title' in item
          );
          shows = paginated.filter(
            (item): item is TMDBIndexShow => 'name' in item
          );
        }
        //If we passed that point, this means one of the lists has run out of results, so we need to abandon
        //the 10 and 10 combined results to just return 20 of the remaining list. This also affects pagination,
        //as, from now on, requested pages do reflect the actual page we're requesting to TMDB.
        //this means our optimistic double fetch is not valid and we have to do it again.
        else {
          const pagesIntoSingleMode = pageNum - crossoverPage;
          const correctedPage = shorterListPages + pagesIntoSingleMode;

          if (
            //if the corrected page number is higher than any list, we skip the fetch, something has gone wrong.
            correctedPage > Math.max(filmTotalPages, showTotalPages)
          ) {
            films = [];
            shows = [];
          }
          //else, we simply fetch again either film or show by the corrected page.
          else {
            const correctedSearchType: TMDBSearchType =
              filmTotalPages > showTotalPages
                ? TMDBSearchType.Movie
                : TMDBSearchType.TV;
            const [indexFilms, indexShows] = await fetchSearchFromTMDBAndParse(
              searchTerm,
              correctedSearchType,
              correctedPage
            );
            //and assign the final result, cleaning the unused array.
            films = indexFilms?.films || [];
            shows = indexShows?.shows || [];
          }
        }
        //we build the combined results object with correct info for the frontend.
        searchResult = {
          total_results: totalResults,
          page: pageNum,
          results: [],
          total_pages: totalPages,
        };
      }

      if (!searchResult) {
        res.json(EMPTY_RESULTS);
        setActiveCache(req, EMPTY_RESULTS);
        return;
      }

      const indexMedia: CreateIndexMedia[] = [
        ...createIndexForFilmBulk(films),
        ...createIndexForShowBulk(shows),
      ];

      //our custom bulk create IndexMedia creates or updates the entries and then populates them
      //with the include we provided to add the associations
      const populatedEntries: IndexMedia[] = await bulkUpsertIndexMedia({
        indexMedia,
        include: buildIndexMediaInclude(req.activeUser),
      });

      const results: IndexMediaResults = {
        indexMedia: toPlainArray(populatedEntries),
        //we consider no results a blank page 1
        totalPages: searchResult.total_pages || 1,
        page: searchResult.page,
        totalResults: searchResult.total_results,
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
