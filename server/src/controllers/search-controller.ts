import express, { Request, Router } from 'express';
import { tmdbAPI } from '../util/config';
import { createIndexForFilmBulk } from '../factories/film-factory';
import { createIndexForShowBulk } from '../factories/show-factory';
import {
  TMDBIndexFilm,
  TMDBIndexFilmArraySchema,
  TMDBIndexShow,
  TMDBIndexShowArraySchema,
} from '../schemas/tmdb-index-media-schemas';
import { CreateIndexMedia } from '../../../shared/types/models';
import {
  arrayToTMDBSearchTypes,
  extractQuery,
} from '../services/search-service';
import { TMDBSearchType } from '../../../shared/types/search';
import { IndexMedia } from '../models';
//import { tmdbAPI } from '../util/config';

const router: Router = express.Router();

//we convert our own query style into TMDB's and return the results, adding any
//entry we don't have to out lightweight IndexMedia table, so it can appear in
//suggestions and quick searches without calling TMDB's API

router.get('/', async (req: Request, res, next) => {
  try {
    const searchTerm: string | undefined = req.query.q?.toString().trim() || '';
    const searchPage: string = req.query.page?.toString() ?? '1';
    const searchTypeString: string[] = extractQuery(req.query.m);
    if (searchTypeString.length < 1) {
      res.json(null);
      return;
    }
    const searchType: TMDBSearchType =
      arrayToTMDBSearchTypes(searchTypeString)[0];

    if (!searchTerm) {
      res.json({ error: 'no query' });
      return;
    }

    const { data } = await tmdbAPI.get(
      `/search/${searchType}?query=${searchTerm}&page=${searchPage}`
    );
    let films: TMDBIndexFilm[] = [];
    let shows: TMDBIndexShow[] = [];

    switch (searchType) {
      case 'movie': {
        films = TMDBIndexFilmArraySchema.parse(data.results);
        break;
      }
      case 'tv': {
        shows = TMDBIndexShowArraySchema.parse(data.results);
        break;
      }
      case 'multi': {
        const moviesArr = data.results.filter(
          (item: TMDBIndexFilm | TMDBIndexShow) =>
            item.media_type === 'movie' || !item.media_type
        );
        const showsArr = data.results.filter(
          (item: TMDBIndexFilm | TMDBIndexShow) =>
            item.media_type === 'tv' || !item.media_type
        );

        const movieResults = TMDBIndexFilmArraySchema.safeParse(moviesArr);
        const showResults = TMDBIndexShowArraySchema.safeParse(showsArr);

        films = movieResults.success ? movieResults.data : [];
        shows = showResults.success ? showResults.data : [];
        break;
      }
    }
    const indexMedia: CreateIndexMedia[] = [
      ...createIndexForFilmBulk(films),
      ...createIndexForShowBulk(shows),
    ];
    await IndexMedia.bulkCreate(indexMedia, {
      updateOnDuplicate: ['popularity', 'image', 'baseRating'],
    });
    res.json(indexMedia);
  } catch (error) {
    next(error);
  }
});

export default router;
