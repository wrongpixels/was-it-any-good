//endpoint for logged in user related requests.

import express, { Request, Response, NextFunction, Router } from 'express';
import { extractURLParams } from '../util/url-param-extractor';
import { PAGE_LENGTH } from '../../../shared/types/search-browse';
import { SortBy } from '../../../shared/types/browse';
import { Rating } from '../models';
import { RatingData, RatingResults } from '../../../shared/types/models';
import { toPlainArray } from '../util/model-helpers';

const router: Router = express.Router();

//main router uses 'authRequired' middleware, so we only reach this routes when a
//verified req.activeUser has been detected

router.get(
  '/votes',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchPage, sortBy, sortDir, findAndCountOptions } =
        extractURLParams(req);
      //SortBy rating must point to Rating's userScore
      if (sortBy === SortBy.Rating) {
        findAndCountOptions.order = [[SortBy.UserScore, sortDir.toUpperCase()]];
      }
      const userId: number = 10;

      const { rows: ratings, count } = await Rating.findAndCountAll({
        where: {
          userId,
        },
        ...findAndCountOptions,
        include: {
          association: 'indexMedia',
        },
      });

      const cleanRatings: RatingData[] = toPlainArray(ratings);

      const ratingsResults: RatingResults = {
        page: searchPage,
        totalPages: Math.ceil(count / PAGE_LENGTH) || 1,
        totalResults: count,
        ratings: cleanRatings,
      };
      res.json(ratingsResults);

      /*
      const limit = PAGE_LENGTH;
      const offset = PAGE_LENGTH * (searchPage - 1);
      const sortColumn =
        {
          [SortBy.VoteDate]: 'rating_updated_at',
          [SortBy.UserScore]: 'user_score',
          [SortBy.Title]: 'media_name',
          [SortBy.Popularity]: 'media_popularity',
          [SortBy.Rating]: 'media_rating',
          [SortBy.Year]: 'media_release_date',
        }[sortBy] || 'rating_updated_at';

      const direction = sortDir === SortDir.Inverted ? 'ASC' : 'DESC';

      // Determine which media types to include based on searchType
      const includeFilms =
        searchType === SearchType.Film || searchType === SearchType.Multi;
      const includeShows =
        searchType === SearchType.Show || searchType === SearchType.Multi;
      const includeSeasons =
        searchType === SearchType.Season || searchType === SearchType.Multi;

      // Build the query dynamically based on searchType
      const unionParts = [];

      if (includeFilms) {
        unionParts.push(`
    -- Films
    SELECT 
      r.id as rating_id,
      r.user_score,
      r.media_id,
      r.media_type,
      r.updated_at as rating_updated_at,
      f.name as media_name,
      f.image as media_image,
      f.rating as media_rating,
      f.popularity as media_popularity,
      NULL::integer as season_index,  -- Cast NULL to integer
      NULL::text as show_name         -- Cast NULL to text
    FROM ratings r
    INNER JOIN films f ON r.media_id = f.id
    WHERE r.user_id = :userId 
      AND r.media_type = 'Film'
  `);
      }

      if (includeShows) {
        unionParts.push(`
    -- Shows  
    SELECT 
      r.id as rating_id,
      r.user_score,
      r.media_id,
      r.media_type,
      r.updated_at as rating_updated_at,
      s.name as media_name,
      s.image as media_image,
      s.rating as media_rating,
      s.popularity as media_popularity,
      NULL::integer as season_index,  -- Cast NULL to integer
      NULL::text as show_name         -- Cast NULL to text
    FROM ratings r
    INNER JOIN shows s ON r.media_id = s.id
    WHERE r.user_id = :userId
      AND r.media_type = 'Show'
  `);
      }

      if (includeSeasons) {
        unionParts.push(`
      -- Seasons (with Show join for parent show name)
      SELECT 
        r.id as rating_id,
        r.user_score,
        r.media_id,
        r.media_type,
        r.updated_at as rating_updated_at,
        se.name as media_name,
        se.image as media_image,
        se.rating as media_rating,
        se.popularity as media_popularity,
        se.index as season_index,
        sh.name as show_name
      FROM ratings r
      INNER JOIN seasons se ON r.media_id = se.id
      LEFT JOIN shows sh ON se.show_id = sh.id
      WHERE r.user_id = :userId
        AND r.media_type = 'Season'
    `);
      }

      // Handle edge case where no valid searchType results in empty query
      if (unionParts.length === 0) {
        res.json({ ratings: [], count: 0 });
        return;
      }

      const sqlQuery = `
    WITH user_media_ratings AS (
      ${unionParts.join('\n      UNION ALL\n')}
    )
    SELECT * FROM user_media_ratings
    ORDER BY ${sortColumn} ${direction}
    LIMIT :limit
    OFFSET :offset;
  `;

      // Count query - also filtered by searchType
      const mediaTypeFilter = [];
      if (includeFilms) mediaTypeFilter.push("'Film'");
      if (includeShows) mediaTypeFilter.push("'Show'");
      if (includeSeasons) mediaTypeFilter.push("'Season'");

      const countQuery = `
    SELECT COUNT(*) as total 
    FROM ratings 
    WHERE user_id = :userId
      AND media_type IN (${mediaTypeFilter.join(', ')});
  `;

      const [results, countResult] = await Promise.all([
        sequelize.query(sqlQuery, {
          replacements: { userId, limit, offset },
          type: 'SELECT',
        }),
        sequelize.query(countQuery, {
          replacements: { userId },
          type: 'SELECT',
        }),
      ]);
*/
      /*
      const formattedResults = results.map((row) => ({
        rating: {
          id: row.rating_id,
          userScore: row.user_score,
          mediaId: row.media_id,
          mediaType: row.media_type,
          updatedAt: row.rating_updated_at,
        },
        media: {
          name: row.media_name,
          image: row.media_image,
          rating: row.media_rating,
          popularity: row.media_popularity,
          mediaType: row.media_type,
          // Season-specific fields
          ...(row.media_type === 'Season' && {
            seasonIndex: row.season_index,
            showName: row.show_name,
          }),
        },
      }));

      res.json({
        ratings: results,
        count: countResult[0],
        page: searchPage,
        pageSize: PAGE_LENGTH,
      }); */
    } catch (error) {
      next(error);
    }
  }
);

export default router;
