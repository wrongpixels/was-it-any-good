import express, { Router, Request, Response, NextFunction } from 'express';
import { IndexMedia } from '../models';
import { FindAndCountOptions, Op, QueryTypes, WhereOptions } from 'sequelize';
import { arrayToSearchType, SearchType } from '../../../shared/types/search';
import { MediaType } from '../../../shared/types/media';
import { CountryCode } from '../../../shared/types/countries';
import {
  OrderBy,
  Sorting,
  stringToOrderBy,
  stringToSorting,
} from '../../../shared/types/browse';
import { extractQuery } from '../util/search-helpers';
import { validateCountries } from '../factories/media-factory';
import { buildIncludeOptions } from '../services/browse-service';
import { toPlainArray } from '../util/model-helpers';
import { PAGE_LENGTH } from '../constants/search-browse-constants';
import { sequelize } from '../util/db';

// Define types for plain IndexMedia and combined results
type PlainIndexMedia = ReturnType<typeof toPlainArray>[number];

type CombinedResult = PlainIndexMedia & {
  mediaType: MediaType.Film | MediaType.Show;
  popularity: number;
};

// Extend BrowseResponse to include combinedResults
declare module '../../../shared/types/models' {
  interface BrowseResponse {
    combinedResults?: CombinedResult[];
  }
}

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchType: SearchType =
      arrayToSearchType(extractQuery(req.query.m)) ?? SearchType.Multi;
    const page = Number(req.query.page) || 1;
    const limit = PAGE_LENGTH; // 20 results
    const offset = (page - 1) * limit;

    // Filters
    const genres = extractQuery(req.query.g) || [];
    const rawC = extractQuery(req.query.c);
    const cRawArr: string[] = Array.isArray(rawC)
      ? rawC
      : rawC != null
      ? [rawC]
      : [];
    const countries: CountryCode[] = validateCountries(cRawArr).filter(
      (c) => c !== 'UNKNOWN'
    );
    const year = req.query.y?.toString();

    // Sorting
    const orderBy: OrderBy =
      stringToOrderBy(req.query.orderBy?.toString()) || OrderBy.Popularity;
    const sort: Sorting =
      stringToSorting(req.query.sort?.toString()) || Sorting.descending;
    const sortDirection = sort === Sorting.ascending ? 'ASC' : 'DESC';

    if (searchType === SearchType.Multi) {
      // Build SQL query for combined search
      const filmQuery = `
        SELECT im.id AS index_media_id, 'film' AS media_type, f.popularity
        FROM index_media im
        JOIN films f ON im.film_id = f.id
        ${
          genres.length > 0
            ? 'LEFT JOIN film_genres fg ON f.id = fg.film_id'
            : ''
        }
        WHERE im.added_to_media = true
        ${
          year
            ? `AND f.release_date BETWEEN '${year}-01-01' AND '${year}-12-31'`
            : ''
        }
        ${
          countries.length > 0
            ? `AND f.country && ARRAY[${countries
                .map((c) => `'${c}'`)
                .join(',')}]::varchar[]`
            : ''
        }
        ${
          genres.length > 0
            ? `AND fg.genre_id IN (${genres.map((g) => `'${g}'`).join(',')})`
            : ''
        }
        ${
          genres.length > 0
            ? 'GROUP BY im.id, f.id HAVING COUNT(DISTINCT fg.genre_id) = ' +
              genres.length
            : ''
        }
      `;

      const showQuery = `
        SELECT im.id AS index_media_id, 'show' AS media_type, s.popularity
        FROM index_media im
        JOIN shows s ON im.show_id = s.id
        ${
          genres.length > 0
            ? 'LEFT JOIN show_genres sg ON s.id = sg.show_id'
            : ''
        }
 folos WHERE im.added_to_media = true
        ${
          year
            ? `AND s.release_date BETWEEN '${year}-01-01' AND '${year}-12-31'`
            : ''
        }
        ${
          countries.length > 0
            ? `AND s.country && ARRAY[${countries
                .map((c) => `'${c}'`)
                .join(',')}]::varchar[]`
            : ''
        }
        ${
          genres.length > 0
            ? `AND sg.genre_id IN (${genres.map((g) => `'${g}'`).join(',')})`
            : ''
        }
        ${
          genres.length > 0
            ? 'GROUP BY im.id, s.id HAVING COUNT(DISTINCT sg.genre_id) = ' +
              genres.length
            : ''
        }
      `;

      // Combine queries with UNION ALL
      const combinedQuery = `
        (${filmQuery})
        UNION ALL
        (${showQuery})
        ORDER BY popularity ${sortDirection}
        LIMIT ${limit} OFFSET ${offset}
      `;

      // Execute query to get IDs and metadata
      const results: {
        index_media_id: number;
        media_type: string;
        popularity: number;
      }[] = await sequelize.query(combinedQuery, { type: QueryTypes.SELECT });

      // Fetch full IndexMedia instances
      const ids = results.map((r) => r.index_media_id);
      const indexMediaList = await IndexMedia.findAll({
        where: { id: ids },
        include: [
          { association: 'film', required: false },
          { association: 'show', required: false },
        ],
      });

      // Map to maintain order from SQL query
      const indexMediaMap = new Map(indexMediaList.map((im) => [im.id, im]));
      const combinedResults: CombinedResult[] = results.map((r) => {
        const im = indexMediaMap.get(r.index_media_id)!;
        const plainIm = im.toJSON() as PlainIndexMedia;
        return {
          ...plainIm,
          mediaType: r.media_type as MediaType.Film | MediaType.Show,
          popularity: r.popularity,
        };
      });

      // Get total count for pagination
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM (
          (${filmQuery})
          UNION ALL
          (${showQuery})
        ) AS combined
      `;
      const countResult: { total: number }[] = await sequelize.query(
        countQuery,
        { type: QueryTypes.SELECT }
      );
      const totalCount = countResult[0].total;
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        page,
        totalPages,
        combinedResults,
      });
    } else {
      // Single-type search (Film or Show)
      const isFilm = searchType === SearchType.Film;
      const association = isFilm ? 'film' : 'show';
      const mediaType = isFilm ? MediaType.Film : MediaType.Show;

      const whereOptions: WhereOptions = {};
      if (year) {
        whereOptions.release_date = {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`],
        };
      }
      if (countries.length > 0) {
        whereOptions.country = { [Op.overlap]: countries };
      }

      const findOptions: FindAndCountOptions = {
        where: { added_to_media: true },
        include: [
          {
            association,
            required: true,
            where: whereOptions,
            include: buildIncludeOptions(genres, mediaType),
          },
        ],
        order: [[orderBy, sort]],
        limit,
        offset,
        distinct: true,
      };

      const { count, rows } = await IndexMedia.findAndCountAll(findOptions);
      const totalResults = count;
      const totalPages = Math.ceil(totalResults / limit);

      res.json({
        page,
        totalFilmResults: isFilm ? totalResults : 0,
        totalShowResults: !isFilm ? totalResults : 0,
        totalPages,
        filmResults: isFilm ? toPlainArray(rows) : undefined,
        showResults: !isFilm ? toPlainArray(rows) : undefined,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
