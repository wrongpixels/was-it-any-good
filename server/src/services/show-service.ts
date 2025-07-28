import { createShow } from '../factories/show-factory';
import {
  TMDBCreditsData,
  TMDBCreditsSchema,
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
import { Show } from '../models';
import { buildCreditsAndGenres, trimCredits } from './media-service';
import { CreateShow } from '../models/media/show';
import Season, { CreateSeason } from '../models/media/season';
import CustomError from '../util/customError';
import { tmdbPaths } from '../util/url-helper';
import { ShowResponse } from '../../../shared/types/models';
import { toPlain } from '../util/model-helpers';

export const buildShowEntry = async (
  params: MediaQueryValues
): Promise<ShowResponse | null> => {
  const showData: ShowData = await fetchTMDBShow(params.mediaId);
  const { scopeOptions, findOptions } = Show.buildMediaQueryOptions(params);
  const showEntry: Show | null = await Show.scope(scopeOptions).create(
    buildShow(showData),
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
    tmdbAPI.get(tmdbPaths.shows.credits(tmdbId)),
    tmdbAPI.get(tmdbPaths.shows.extIds(tmdbId)),
  ]);
  const showInfoData: TMDBShowInfoData = TMDBShowInfoSchema.parse(showRes.data);
  const creditsData: TMDBCreditsData = trimCredits(
    TMDBCreditsSchema.parse(creditsRes.data)
  );
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

export const buildShow = (showData: ShowData): CreateShow => ({
  ...showData,
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
