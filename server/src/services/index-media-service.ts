import path from 'path';
import fs from 'fs/promises';
import { MediaType } from '../../../shared/types/media';
import { ActiveUser, CreateIndexMedia } from '../../../shared/types/models';
import IndexMedia from '../models/media/indexMedia';
import { tmdbAPI } from '../util/config';
import { FilmData, SeasonData, ShowData } from '../types/media/media-types';
import { getYearNum } from '../../../shared/helpers/format-helper';
import { Includeable, Op, Transaction } from 'sequelize';
import { buildIncludeOptions } from './browse-service';
import { toPlain } from '../util/model-helpers';
import { isUnreleased } from '../../../shared/helpers/media-helper';

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

interface BulkUpsertIndexMediaValues {
  indexMedia: CreateIndexMedia[];
  //so we can then return the updated entries with the includes we need
  include?: Includeable | Includeable[];
  transaction?: Transaction;
}

export const bulkUpsertIndexMedia = async ({
  indexMedia,
  include,
  transaction,
}: BulkUpsertIndexMediaValues): Promise<IndexMedia[]> => {
  //as sequelize doesn't allow for a 'conditional update' for the ratings, we do the following.

  //first, we upsert all indexMedia with the minimum fields to update. This will return our existing entry or the just created one,
  //allowing us to access the current rating and baseRating
  const upsertMedia: IndexMedia[] = await IndexMedia.bulkCreate(indexMedia, {
    updateOnDuplicate: ['popularity', 'name', 'image', 'releaseDate', 'tmdbId'],
    returning: true,
    transaction,
  });

  //now, we decide which baseRatings should be updated if possible.
  //basically, we update if the media is not on our db or if it has not been voted by users yet.
  const mediaRatingToUpdate: CreateIndexMedia[] = [];

  //we map the original IndexMedia array so we can get each entry by tmdbId faster
  const originalMediaMap: Map<number, CreateIndexMedia> = new Map<
    number,
    CreateIndexMedia
  >(indexMedia.map((im) => [im.tmdbId, im]));

  upsertMedia.forEach((im: IndexMedia) => {
    if (
      !im.addedToMedia ||
      im.voteCount === 0 ||
      (im.mediaType === MediaType.Film && im.voteCount === 1 && im.baseRating)
    ) {
      //if unreleased, we skip, as for some reason, TMDB sometimes has user ratings for unreleased media... no comments
      if (isUnreleased(im.releaseDate)) {
        console.log('Skipping unreleased entry');
        return;
      }
      //we get the matching indexMedia by tmdbId
      const entry = originalMediaMap.get(im.tmdbId);
      const newBaseRating: number = entry?.baseRating || 0;
      //and only accept a valid and different newBaseRatings
      if (newBaseRating && newBaseRating !== im.baseRating) {
        console.log(
          'Updating indexMedia base rating of',
          im.name,
          newBaseRating,
          im.baseRating
        );
        im.baseRating = newBaseRating;
        im.rating = newBaseRating;
        mediaRatingToUpdate.push(toPlain(im));
      }
    }
  });

  //as there's no "bulkUpdate" operation in sequelize for different data in each entry, we use again bulkCreate with
  //updateOnDuplicate, as it will quite literally only update the 'rating' and 'baseRating' fields.
  const updatedEntries: IndexMedia[] = await IndexMedia.bulkCreate(
    mediaRatingToUpdate,
    {
      updateOnDuplicate: ['rating', 'baseRating', 'tmdbId', 'mediaType'],
      returning: true,
      transaction,
    }
  );

  console.log(
    'Updated',
    `${updatedEntries.length}/${indexMedia.length}`,
    'baseRatings'
  );
  //we extract the ids

  const ids: number[] = upsertMedia.map((im: IndexMedia) => im.id);

  //and, finally, we return the populated entries
  return await IndexMedia.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
    include,
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
    attributes: ['id', 'rating', 'seasonCount'],
    include: buildIncludeOptions(undefined, MediaType.Show, false, activeUser),
  },
];
