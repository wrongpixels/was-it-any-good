import express, { Router } from 'express';
import { TMDBSearchType } from '../../../shared/types/search';
import { extractQuery, arrayToTMDBSearchTypes } from '../util/search-helpers';
import { FilmResponse } from '../../../shared/types/models';
import { Film, Genre, MediaGenre, Show } from '../models';
import {
  FindOptions,
  Includeable,
  IncludeOptions,
  Op,
  WhereOptions,
} from 'sequelize';
import { MediaType } from '../../../shared/types/media';
import { CountryCode } from '../../../shared/types/countries';
import { validateCountries } from '../factories/media-factory';
import { OrderBy, Sorting } from '../../../shared/types/browse';

const router: Router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const searchTypeString: string[] = extractQuery(req.query.m);
    const searchPage: string = req.query.page?.toString() ?? '1';
    const genres: string[] = extractQuery(req.query.g);
    const countries: CountryCode[] = validateCountries(
      extractQuery(req.query.c)
    );
    const year: string | undefined = req.query.y?.toString();
    const orderBy: OrderBy | undefined = req.query.orderBy?.toString();
    const sortBy: Sorting | undefined = req.query.sortBy?.toString();

    if (searchTypeString.length < 1) {
      searchTypeString.push('multi');
    }
    const findOptions: FindOptions<Film | Show> = { include: [] };
    const where: WhereOptions<Film | Show> = {};
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

    const searchType: TMDBSearchType =
      arrayToTMDBSearchTypes(searchTypeString)[0];
    const matches: FilmResponse[] = await Film.findAll({
      raw: true,
      order: [['baseRating', 'ASC']],
      limit: 20,
    });
    res.json(matches);
  } catch (error) {
    next(error);
  }
});

export default router;
