import { createShow } from '../factories/show-factory';
import {
  TMDBCreditsData,
  TMDBShowCreditsData,
  TMDBShowCreditsSchema,
} from '../schemas/tmdb-media-schema';
import {
  TMDBExternalIdSchema,
  TMDBImdbData,
  TMDBShowData,
  TMDBShowInfoData,
  TMDBShowInfoSchema,
} from '../schemas/tmdb-show-schema';
import {
  MediaQueryValues,
  SeasonData,
  ShowData,
} from '../types/media/media-types';
import { tmdbAPI } from '../util/config';
import { IndexMedia, Show } from '../models';
import { buildCreditsAndGenres } from './media-service';
import { CreateShow } from '../models/media/show';
import Season, { CreateSeason } from '../models/media/season';
import CustomError from '../util/customError';
import { tmdbPaths } from '../util/url-helper';
import { CreateIndexMedia, ShowResponse } from '../../../shared/types/models';
import { toPlain } from '../util/model-helpers';
import {
  upsertIndexMedia,
  mediaDataToCreateIndexMedia,
  bulkCreateIndexMedia,
} from './index-media-service';
import { formatTMDBShowCredits } from '../util/tmdb-credits-formatter';
import { reorderSeasons } from '../../../shared/helpers/media-helper';
import { AxiosResponse } from 'axios';
import { Transaction } from 'sequelize';
import { sequelize } from '../util/db/initialize-db';

//the main function to handle creating a new show
export const buildShowEntry = async (
  params: MediaQueryValues
): Promise<ShowResponse | null> => {
  const showData: ShowData = await fetchTMDBShowFull(params.mediaId);

  //we first use the data to build or update the matching indexMedia via upsert
  //we could findOrCreate, but setting fresh data is preferred

  const indexMedia: IndexMedia | null = await upsertIndexMedia(
    mediaDataToCreateIndexMedia(showData),
    params.transaction
  );
  if (!indexMedia?.id) {
    throw new CustomError('Error creating Index Media', 400);
  }
  const { scopeOptions, findOptions } = Show.buildMediaQueryOptions(params);
  const indexId = indexMedia.id;
  const showEntry: Show | null = await Show.scope(scopeOptions).create(
    buildShow(showData, indexId),
    {
      transaction: params.transaction,
    }
  );
  if (!showEntry) {
    throw new CustomError('Show could not be created', 400);
  }
  console.log('Created show!');
  //we bulk create the season entries and their indexMedia

  //indexMedia have to be created first so we can assign their ids to the Season entry
  const createSeasonsIndexMedia: CreateIndexMedia[] = showData.seasons.map(
    (s: SeasonData) => mediaDataToCreateIndexMedia(s, showData.name)
  );
  //and we save them in the db
  const seasonsIndexMedia: IndexMedia[] = await bulkCreateIndexMedia(
    createSeasonsIndexMedia,
    params.transaction
  );

  const seasons: CreateSeason[] = showData.seasons.map((s: SeasonData) =>
    buildSeason(
      s,
      showEntry,
      //we find the matching indexMedia entry by tmdbId and we pass it to link them.
      //If any match fails, buildSeason will throw an error.
      seasonsIndexMedia.find((i: IndexMedia) => i.tmdbId === s.tmdbId)
    )
  );

  //and we finally create the seasons, credits and genres in the db
  await Promise.allSettled([
    Season.bulkCreate(seasons, {
      ignoreDuplicates: true,
      transaction: params.transaction,
    }),
    buildCreditsAndGenres(showEntry, showData, params.transaction),
  ]);

  //we reload after creating the credits and season associations so the final entry is populated
  await showEntry.reload({
    ...findOptions,
  });
  //shows need to calculate the indexMedia rating considering the seasons
  //after reloading the final show entry with them populated, we sync the rating on indexMedia
  await showEntry.syncIndex(params.transaction);
  const showResponse: ShowResponse | null = toPlain(showEntry);
  //order tends to fail in sequelize after a reload, so we enforce it manually by season index
  if (showResponse?.seasons) {
    showResponse.seasons = reorderSeasons(showResponse);
  }
  return showResponse;
};

export const fetchTMDBShowFull = async (
  tmdbId: string | number
): Promise<ShowData> => {
  const [showRes, creditsRes, externalIdsRes] = await Promise.all([
    tmdbAPI.get(tmdbPaths.shows.byTMDBId(tmdbId)),
    tmdbAPI.get(tmdbPaths.shows.extendedCredits(tmdbId)),
    //for some reason, the imdbId is not included in show entries
    tmdbAPI.get(tmdbPaths.shows.extIds(tmdbId)),
  ]);
  const showInfoData: TMDBShowInfoData = TMDBShowInfoSchema.parse(showRes.data);

  const showCreditsData: TMDBShowCreditsData | undefined =
    TMDBShowCreditsSchema.safeParse(creditsRes.data)['data'];

  if (!showCreditsData) {
    throw new CustomError('Error creating entry credits', 400);
  }

  //TMDB show credits endpoint is unreliable, providing incomplete data or a single season's.
  //instead, we fetch the 'aggregate_credits' for the full cast/crew history.
  //these use a different data structure than all other credits, so in order to
  //maintain a single pipeline for creating all our media (film, season, show),
  //we transform extended credits into the TMDBCreditsData our factories expect:
  const creditsData: TMDBCreditsData = formatTMDBShowCredits(showCreditsData);

  const imdbData: TMDBImdbData = TMDBExternalIdSchema.parse(
    externalIdsRes.data
  );

  const showData: TMDBShowData = {
    ...showInfoData,
    credits: creditsData,
    imdb_id: imdbData.imdb_id,
  };

  const actualShowData: ShowData = createShow(showData);
  return actualShowData;
};

//to update shows in case of new seasons
export const updateShowEntry = async (showEntry: Show) => {
  //we fetch a fresh version of the show
  const newShowTMDBData: TMDBShowInfoData = await fetchTMDBShowData(
    showEntry.tmdbId
  );
  const showDiff: number =
    newShowTMDBData.number_of_seasons - showEntry.seasonCount;
  if (showDiff) {
    const transaction: Transaction = await sequelize.transaction();
    console.log(`Found ${showDiff} new Season(s)!`);
    const newShowData: ShowData = await fetchTMDBShowFull(showEntry.tmdbId);
    const newSeasonsData: SeasonData[] = newShowData.seasons.slice(-showDiff);
    console.log(newSeasonsData);
    const createSeasonsIndexMedia: CreateIndexMedia[] = newSeasonsData.map(
      (s: SeasonData) => mediaDataToCreateIndexMedia(s, showEntry.name)
    );
    const seasonsIndexMedia: IndexMedia[] = await bulkCreateIndexMedia(
      createSeasonsIndexMedia,
      transaction
    );
    const newSeasons: CreateSeason[] = newSeasonsData.map((s: SeasonData) =>
      buildSeason(
        s,
        showEntry,
        seasonsIndexMedia.find((i: IndexMedia) => i.tmdbId === s.tmdbId)
      )
    );
    const seasons: Season[] = await Season.bulkCreate(newSeasons, {
      ignoreDuplicates: true,
      transaction,
    });
    console.log(newSeasons, seasons);
    await Promise.allSettled([
      //we also refresh the possible new cast and so
      buildCreditsAndGenres(showEntry, newShowData, transaction),
      //and update our existing showEntry

      showEntry.update({
        seasons: { ...showEntry.seasons, ...seasons },
        seasonCount: showEntry.seasonCount + seasons.length,
      }),
    ]);
    await showEntry.reload();
    await showEntry.syncIndex(transaction);
  }
};

export const fetchTMDBShowData = async (tmdbId: number | string) => {
  const showRes: AxiosResponse = await tmdbAPI.get(
    tmdbPaths.shows.byTMDBId(tmdbId)
  );
  const showInfoData: TMDBShowInfoData = TMDBShowInfoSchema.parse(showRes.data);
  return showInfoData;
};

export const buildShow = (showData: ShowData, indexId: number): CreateShow => ({
  ...showData,
  seasons: undefined,
  indexId,
  imdbId: showData.imdbId ? showData.imdbId : undefined,
  releaseDate: showData.releaseDate,
  country: showData.countries,
  parentalGuide: null,
});

const buildSeason = (
  seasonData: SeasonData,
  showEntry: Show,
  indexMedia?: IndexMedia
): CreateSeason => {
  if (!indexMedia?.id) {
    throw new CustomError('Error creating Index Media', 400);
  }
  return {
    ...seasonData,
    showId: showEntry.id,
    country: showEntry.country,
    indexId: indexMedia.id,
  };
};
