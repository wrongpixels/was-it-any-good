import path from 'path';
import fs from 'fs/promises';
import { MediaType } from '../../../shared/types/media';
import { ActiveUser, CreateIndexMedia } from '../../../shared/types/models';
import IndexMedia from '../models/media/indexMedia';
import { tmdbAPI } from '../util/config';
import { FilmData, SeasonData, ShowData } from '../types/media/media-types';
import { getYearNum } from '../../../shared/helpers/format-helper';
import { Includeable, Transaction } from 'sequelize';
import { buildIncludeOptions } from './browse-service';

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
  releaseDate: data.releaseDate,
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

export const bulkUpsertIndexMedia = async (
  indexMedia: CreateIndexMedia[],
  transaction?: Transaction
): Promise<IndexMedia[]> => {
  return await IndexMedia.bulkCreate(indexMedia, {
    updateOnDuplicate: [
      'popularity',
      'name',
      'image',
      'releaseDate' /*'baseRating'*/,
    ],
    returning: true,
    transaction,
  });
};
//a common include builder for our IndexMedia.
//it allows to add active user-related data, like the rating or list
//information without the limitation of a scope.
export const buildIndexMediaInclude = (
  activeUser: ActiveUser | undefined
): Includeable | Includeable[] | undefined => [
  //we still need the film/show ids, rating and genres for the frontend
  {
    association: 'film',
    attributes: ['id', 'rating'],
    include: buildIncludeOptions(undefined, MediaType.Film, false, activeUser),
  },
  {
    association: 'show',
    attributes: ['id', 'rating'],
    include: buildIncludeOptions(undefined, MediaType.Show, false, activeUser),
  },
];
