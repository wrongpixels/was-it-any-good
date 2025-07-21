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
//import { tmdbAPI } from '../util/config';

const router: Router = express.Router();

router.get('/:media', async (req: Request, res, next) => {
  try {
    const queryType: string = req.params.media;
    const query: string | undefined = req.query.q?.toString() || '';

    if (!query) {
      res.json({ error: 'no query' });
      return;
    }

    const { data } = await tmdbAPI.get(
      `/search/${queryType}?query=${query}&page=1`
    );
    let films: TMDBIndexFilm[] = [];
    let shows: TMDBIndexShow[] = [];

    switch (queryType) {
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

    const movieResults = createIndexForFilmBulk(films);
    const showResults = createIndexForShowBulk(shows);
    const indexMedia = [...movieResults, ...showResults];

    res.json(indexMedia);
  } catch (error) {
    next(error);
  }
});

export default router;
