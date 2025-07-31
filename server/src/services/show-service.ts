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
import { ShowResponse } from '../../../shared/types/models';
import { toPlain } from '../util/model-helpers';
import {
  upsertIndexMedia,
  mediaDataToCreateIndexMedia,
} from './index-media-service';
import { formatTMDBShowCredits } from '../util/tmdb-credits-formatter';

export const buildShowEntry = async (
  params: MediaQueryValues
): Promise<ShowResponse | null> => {
  const showData: ShowData = await fetchTMDBShow(params.mediaId);
  const { scopeOptions, findOptions } = Show.buildMediaQueryOptions(params);

  //we first use the data to build or update the matching indexMedia via upsert
  //we could findOrCreate, but setting fresh data is preferred

  const indexMedia: IndexMedia | null = await upsertIndexMedia(
    mediaDataToCreateIndexMedia(showData),
    params.transaction
  );
  if (!indexMedia?.id) {
    throw new CustomError('Error creating Index Media', 400);
  }
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
  const seasons: CreateSeason[] = showData.seasons.map((s: SeasonData) =>
    buildSeason(s, showEntry)
  );
  await Season.bulkCreate(seasons, {
    ignoreDuplicates: true,
    transaction: params.transaction,
  });
  await buildCreditsAndGenres(showEntry, showData, params.transaction);
  await showEntry.reload({ ...findOptions });
  return toPlain(showEntry);
};

export const fetchTMDBShow = async (
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

export const buildShow = (showData: ShowData, indexId: number): CreateShow => ({
  ...showData,
  indexId,
  imdbId: showData.imdbId ? showData.imdbId : undefined,
  releaseDate: showData.releaseDate,
  country: showData.countries,
  parentalGuide: null,
});

const buildSeason = (
  seasonData: SeasonData,
  showEntry: Show
): CreateSeason => ({
  ...seasonData,
  showId: showEntry.id,
  country: showEntry.country,
});
