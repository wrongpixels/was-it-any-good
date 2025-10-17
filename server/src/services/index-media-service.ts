import path from 'path';
import fs from 'fs/promises';
import { MediaType } from '../../../shared/types/media';
import { CreateIndexMedia } from '../../../shared/types/models';
import IndexMedia from '../models/media/indexMedia';
import { tmdbAPI } from '../util/config';
import { FilmData, SeasonData, ShowData } from '../types/media/media-types';
import { getYearNum } from '../../../shared/helpers/format-helper';
import { Transaction } from 'sequelize';
import { sequelize } from '../util/db/initialize-db';

export const mediaDataToCreateIndexMedia = (
  data: FilmData | ShowData | SeasonData,
  showName: string = ''
): CreateIndexMedia => ({
  tmdbId: data.tmdbId,
  image: data.image,
  addedToMedia: true,
  year: getYearNum(data.releaseDate),
  country: data.countries,
  //for seasons, we override the name to contain the parent show's for sorting reasons
  name:
    data.mediaType === MediaType.Season
      ? `${showName}: Season ${data.index}`
      : data.name,
  rating: data.rating,
  baseRating: data.baseRating,
  voteCount: data.voteCount,
  popularity: data.popularity,
  mediaType: data.mediaType,
});

const PAGES_TO_GATHER: number = 10;
const DB_PATH: string = path.join(__dirname, '../db');
/*
export const TMDBIndexToIndexMedia = (): CreateIndexMedia[] => {
  const testFilm: TMDBIndexFilm[] = TMDBIndexFilmArraySchema.parse(jsonFilms);
  const testShow: TMDBIndexShow[] = TMDBIndexShowArraySchema.parse(jsonShows);

  const uniqueIndexMedia = new Map<string, CreateIndexMedia>();

  createIndexForMediaBulk(testFilm, testShow).forEach(
    (im: CreateIndexMedia) => {
      const key = `${im.tmdbId}-${im.mediaType}`;
      uniqueIndexMedia.set(key, im);
    }
  );
  return Array.from(uniqueIndexMedia.values());
};
*/
export const gatherMedia = async (mediaType: MediaType): Promise<number> => {
  const media: unknown[] = [];

  for (let page = 1; page <= PAGES_TO_GATHER; page++) {
    const response = await tmdbAPI.get(
      `/discover/${mediaType === MediaType.Film ? 'movie' : 'tv'}`,
      {
        params: {
          include_adult: false,
          include_video: false,
          language: 'en-US',
          page,
          sort_by: 'popularity.desc',
        },
      }
    );
    media.push(...response.data.results);
  }

  await fs.mkdir(DB_PATH, { recursive: true });
  await fs.writeFile(
    path.join(
      DB_PATH,
      `popular-${mediaType === MediaType.Film ? 'films' : 'shows'}-db2.json`
    ),
    JSON.stringify(media, null, 2)
  );
  return media.length;
};

export const upsertIndexMedia = async (
  data: CreateIndexMedia,
  transaction?: Transaction
): Promise<IndexMedia | null> => {
  const [indexEntry] = await IndexMedia.upsert(data, { transaction });
  return indexEntry;
};
//SQL version so we can update certain fields conditionally.
//specifically, we only update baseRating when a valid one has been added (for entries without
//a valid rating that gets added eventually).
export const bulkUpsertIndexMedia = async (
  indexMedia: CreateIndexMedia[],
  transaction?: Transaction
): Promise<IndexMedia[]> => {
  if (!indexMedia.length) {
    return [];
  }

  const params: (string | number)[] = [];

  const valuePlaceholders = indexMedia
    .map((_, i) => {
      const offset = i * 8;
      return `(
        $${offset + 1},
        $${offset + 2},
        $${offset + 3},
        $${offset + 4},
        $${offset + 5},
        $${offset + 6},
        $${offset + 7},
        $${offset + 8}
      )`;
    })
    .join(',\n');

  for (const m of indexMedia) {
    params.push(
      m.tmdbId,
      m.mediaType,
      m.name,
      m.image,
      m.popularity,
      m.baseRating,
      m.voteCount,
      m.rating
    );
  }

  const query = `
    INSERT INTO index_media (
      tmdb_id,
      media_type,
      name,
      image,
      popularity,
      base_rating,
      vote_count,
      rating
    )
    VALUES
      ${valuePlaceholders}
    ON CONFLICT (tmdb_id, media_type)
    DO UPDATE SET
      name = EXCLUDED.name,
      image = EXCLUDED.image,
      popularity = EXCLUDED.popularity,
      base_rating = CASE
        WHEN index_media.base_rating = 0 THEN EXCLUDED.base_rating
        ELSE index_media.base_rating
      END
    RETURNING *;
  `;

  const result: unknown[] = await sequelize.query(query, {
    bind: params,
    transaction,
    model: IndexMedia,
    mapToModel: true,
  });

  const rows = result[0] as IndexMedia[];
  return rows;
};
/*
export const bulkUpsertIndexMedia = async (
  indexMedia: CreateIndexMedia[],
  transaction?: Transaction
): Promise<IndexMedia[]> => {
  return await IndexMedia.bulkCreate(indexMedia, {
    updateOnDuplicate: ['popularity', 'name', 'image', 'baseRating'],
    returning: true,
    transaction,
  });
};

//SQL version so we can update certain fields conditionally.
//specifically, we only update voteCount when baseRating has been added (for entries without
//a valid rating that gets added eventually).
//baseRating keeps being updated and will be taken into account in the next user vote, or if no
//user vote has taken place yet, we update rating to show immediately the new average
export const bulkCreateIndexMedia = async (
  indexMedia: CreateIndexMedia[],
  transaction?: Transaction
): Promise<IndexMedia[]> => {
  if (!indexMedia.length) return [];

  const params: (string | number)[] = [];
  const valuePlaceholders = indexMedia
    .map((_, i) => {
      const offset = i * 8;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4},
               $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8})`;
    })
    .join(',\n');

  indexMedia.forEach((m) => {
    params.push(
      m.tmdbId,
      m.mediaType,
      m.name,
      m.image,
      m.popularity,
      m.baseRating,
      m.voteCount,
      m.rating
    );
  });

  const query = `
    INSERT INTO index_media
      (tmdb_id, media_type, name, image, popularity, base_rating, vote_count, rating)
    VALUES
      ${valuePlaceholders}
    ON CONFLICT (tmdb_id, media_type) DO UPDATE
    SET
      name         = EXCLUDED.name,
      image        = EXCLUDED.image,
      popularity   = EXCLUDED.popularity,
      base_rating  = EXCLUDED.base_rating,
      vote_count = CASE
        WHEN index_media.base_rating = 0
             AND index_media.vote_count = 0
             AND index_media.rating = 0
             AND EXCLUDED.base_rating > 0
          THEN 1
        ELSE index_media.vote_count
      END,
      rating = CASE
        WHEN index_media.base_rating = 0
             AND index_media.vote_count = 0
             AND index_media.rating = 0
             AND EXCLUDED.base_rating > 0
          THEN EXCLUDED.base_rating
        ELSE index_media.rating
      END
    RETURNING *;
  `;

  const result: unknown[] = await sequelize.query(query, {
    bind: params,
    transaction,
    model: IndexMedia,
    mapToModel: true,
  });

  const rows = result[0] as IndexMedia[];
  return rows;
};
*/
