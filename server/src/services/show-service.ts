import { Transaction } from 'sequelize';
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
import { SeasonData, ShowData } from '../types/media/media-types';
import { tmdbAPI } from '../util/config';
import { Show } from '../models';
import { buildCreditsAndGetEntry, trimCredits } from './media-service';
import { CreateShow } from '../models/show';
import Season, { CreateSeason } from '../models/season';
import CustomError from '../util/customError';

export const buildShowEntry = async (
  tmdbId: string,
  transaction: Transaction
): Promise<Show | null> => {
  const showData: ShowData = await fetchTMDBShow(tmdbId);
  const showEntry: Show | null = await Show.create(buildShow(showData), {
    transaction,
  });
  if (!showEntry) {
    throw new CustomError('Show could not be created', 400);
  }
  const showId = showEntry.id;
  console.log('Created show!');

  const seasonEntries: (Season | null)[] = await Promise.all(
    showData.seasons.map((s: SeasonData) =>
      Season.create(buildSeason(s, showEntry), { transaction })
    )
  );
  if (!seasonEntries || seasonEntries.length <= 0) {
    throw new CustomError(
      `Seasons for Show ${showId} could not be created`,
      400
    );
  }
  return await buildCreditsAndGetEntry(showEntry, showData, transaction);
};

export const fetchTMDBShow = async (id: string): Promise<ShowData> => {
  const showRes = await tmdbAPI.get(`/tv/${id}`);
  const creditsRes = await tmdbAPI.get(`/tv/${id}/credits`);
  const externalIdsRes = await tmdbAPI.get(`/tv/${id}/external_ids`);
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
  releaseDate: showData.releaseDate,
  country: showData.countries,
  rating: 0,
  voteCount: 0,
  parentalGuide: null,
});

const buildSeason = (
  seasonData: SeasonData,
  showEntry: Show
): CreateSeason => ({
  ...seasonData,
  showId: showEntry.id,
  country: showEntry.country,
  voteCount: 0,
  rating: 0,
});
