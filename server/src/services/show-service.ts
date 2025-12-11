import { createShow } from '../factories/show-factory';
import { TMDBCreditsData } from '../schemas/tmdb-media-schema';
import {
  TMDBFullShowInfoSchema,
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
import {
  CreateIndexMedia,
  SeasonResponse,
  ShowResponse,
} from '../../../shared/types/models';
import { toPlain } from '../util/model-helpers';
import {
  upsertIndexMedia,
  mediaDataToCreateIndexMedia,
  bulkUpsertIndexMedia,
} from './index-media-service';
import { formatTMDBShowCredits } from '../util/tmdb-credits-formatter';
import {
  isUnreleased,
  reorderSeasons,
} from '../../../shared/helpers/media-helper';
import { AxiosResponse } from 'axios';
import { Transaction } from 'sequelize';
import { sequelize } from '../util/db/initialize-db';
import { DEF_IMAGE_MEDIA } from '../../../shared/defaults/media-defaults';

//the main function to handle creating a new show
export const buildShowEntry = async (
  params: MediaQueryValues
): Promise<ShowResponse | null> => {
  const showData: ShowData = await fetchAndProcessTMDBShowFull(params.mediaId);

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
  const seasonsIndexMedia: IndexMedia[] = await bulkUpsertIndexMedia({
    indexMedia: createSeasonsIndexMedia,
    transaction: params.transaction,
  });

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

export const fetchAndProcessTMDBShowFull = async (
  tmdbId: string | number
): Promise<ShowData> => {
  //we fetch the full show with appended extended credits and external ids
  const showRes: AxiosResponse = await tmdbAPI.get(
    tmdbPaths.shows.withCreditsAndIds(tmdbId)
  );
  //we extract the extended credits and the external ids, leaving the show data
  const { aggregate_credits, external_ids, ...rawShowData } =
    TMDBFullShowInfoSchema.parse(showRes.data);

  //TMDB show credits endpoint is unreliable, providing incomplete data or a single season's.
  //instead, we used the 'aggregate_credits' for the full cast/crew history.
  //these use a different data structure than all other credits, so in order to
  //maintain a single pipeline for creating all our media (film, season, show),

  //we transform extended credits into the TMDBCreditsData our factories expect:
  const creditsData: TMDBCreditsData = formatTMDBShowCredits(aggregate_credits);

  //and we construct our final TMDBShowData object with everything in the expected format
  const showData: TMDBShowData = {
    ...rawShowData,
    credits: creditsData,
    imdb_id: external_ids.imdb_id,
  };

  const actualShowData: ShowData = createShow(showData);
  return actualShowData;
};

//to update shows in case of new seasons
export const updateShowEntry = async (showEntry: Show) => {
  //we fetch a fresh light version of the show, with no credits
  const newShowTMDBData: TMDBShowInfoData = await fetchTMDBShow(
    showEntry.tmdbId
  );
  const seasonDiff: number =
    newShowTMDBData.number_of_seasons - showEntry.seasonCount;
  const episodeDiff: number =
    newShowTMDBData.number_of_episodes - showEntry.episodeCount;

  const fullUpdate: boolean =
    showEntry.lastAirDate !== newShowTMDBData.last_air_date ||
    seasonDiff !== 0 ||
    episodeDiff !== 0;

  //we only need a transaction for full updates.
  const transaction: Transaction | undefined = fullUpdate
    ? await sequelize.transaction()
    : undefined;
  try {
    //the promises to run at the end of the process.
    //No matter what, we'll update some basic info with the light data we have
    const promises: Promise<unknown>[] = [
      showEntry.update(
        {
          lastAirDate: newShowTMDBData.last_air_date,
          seasonCount: newShowTMDBData.number_of_seasons,
          episodeCount: newShowTMDBData.number_of_episodes,
          image: newShowTMDBData.poster_path ?? showEntry.image,
          baseRating: newShowTMDBData.vote_average ?? showEntry.baseRating,
          popularity: newShowTMDBData.popularity ?? showEntry.popularity,
          description: newShowTMDBData.overview ?? showEntry.description,
          dataUpdatedAt: new Date(),
        },
        { transaction }
      ),
    ];

    //if a new season or more episodes are found, we update the show in more depth
    if (fullUpdate) {
      console.log(
        seasonDiff
          ? `Found ${seasonDiff} new Season(s)!`
          : `Found ${episodeDiff} new episodes!`
      );
      //first, we fetch a full version of the Show
      const newShowData: ShowData = await fetchAndProcessTMDBShowFull(
        showEntry.tmdbId
      );

      //and we push to promises an updated cast and crew
      promises.push(buildCreditsAndGenres(showEntry, newShowData, transaction));

      //then, we check for any existing Season that might be missing core data or has a releaseDate
      //set later than our last update
      const missingSeasonData: SeasonResponse | undefined =
        showEntry.seasons?.find(
          (s: SeasonResponse) =>
            s.baseRating <= 0 ||
            s.image === DEF_IMAGE_MEDIA ||
            (s.releaseDate &&
              showEntry.updatedAt &&
              new Date(s.releaseDate) > new Date(showEntry.updatedAt))
        );
      //we only rebuild seasons if new seasons or were found or if we
      //have incomplete seasons.
      if (seasonDiff > 0 || missingSeasonData) {
        const newSeasonsData: SeasonData[] = newShowData.seasons;
        const createSeasonsIndexMedia: CreateIndexMedia[] = newSeasonsData.map(
          (s: SeasonData) => mediaDataToCreateIndexMedia(s, showEntry.name)
        );
        //we bulk upsert the indexMedia of all seasons, which will update basic fields
        const seasonsIndexMedia: IndexMedia[] = await bulkUpsertIndexMedia({
          indexMedia: createSeasonsIndexMedia,
          transaction,
        });
        const newSeasons: CreateSeason[] = newSeasonsData.map((s: SeasonData) =>
          buildSeason(
            s,
            showEntry,
            seasonsIndexMedia.find((i: IndexMedia) => i.tmdbId === s.tmdbId)
          )
        );
        //we push the promise to bulk create/update all new and refreshed seasons
        promises.push(
          Season.bulkCreate(newSeasons, {
            updateOnDuplicate: [
              'baseRating',
              'releaseDate',
              'popularity',
              'episodeCount',
              'image',
              'description',
              'rating',
              'voteCount',
              'name',
            ],
            returning: true,
            transaction,
          })
        );
      }
    }
    //and we run the promises and commit the transaction
    await Promise.all(promises);
    if (transaction) {
      await transaction.commit();
    }
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Rollback:', error);
    throw error;
  }
  await showEntry.reload();
  reorderSeasons(showEntry);
  console.log('Post-reload seasons:', showEntry.seasons?.length);
  console.log('Post-reload episodes:', showEntry.episodeCount);
};

export const tryFetchTMDBShow = async (
  tmdbId: string | number
): Promise<TMDBShowInfoData | undefined> => {
  try {
    return await fetchTMDBShow(tmdbId);
  } catch (_error) {
    console.log(tmdbId, 'does not match a valid Show TMDB Id.');
  }
  return;
};

export const fetchTMDBShow = async (
  tmdbId: number | string
): Promise<TMDBShowInfoData> => {
  const showRes: AxiosResponse = await tmdbAPI.get(
    tmdbPaths.shows.byTMDBId(tmdbId)
  );
  const showInfoData: TMDBShowInfoData = TMDBShowInfoSchema.parse(showRes.data);
  return showInfoData;
};

export const buildShow = (showData: ShowData, indexId: number): CreateShow => {
  //because TMDB for some reason allows people to vote before release date, we have to do this mess
  //to avoid setting an early baseRating and rating.
  const releaseDate: string | null = showData.releaseDate;
  const unreleased: boolean = isUnreleased(releaseDate);
  //to overwrite the possible baseRating.
  const correctedRating: number | undefined = unreleased ? 0 : undefined;

  return {
    ...showData,
    seasons: undefined,
    indexId,
    imdbId: showData.imdbId ? showData.imdbId : undefined,
    releaseDate: showData.releaseDate,
    country: showData.countries,
    parentalGuide: null,
    baseRating: correctedRating ?? showData.baseRating,
    rating: correctedRating ?? showData.rating,
    voteCount: unreleased ? 0 : showData.voteCount,
    dataUpdatedAt: new Date(),
  };
};

const buildSeason = (
  seasonData: SeasonData,
  showEntry: Show,
  indexMedia?: IndexMedia
): CreateSeason => {
  if (!indexMedia?.id) {
    throw new CustomError('Error creating Index Media', 400);
  }
  //because TMDB for some reason allows people to vote before release date, we have to do this mess
  //to avoid setting an early baseRating and rating.
  const releaseDate: string | null = seasonData.releaseDate;
  const unreleased: boolean = isUnreleased(releaseDate);

  //so, in case we are updating existing seasons, we keep their cached ratings
  const existingSeason: SeasonResponse | undefined = !showEntry.seasons
    ? undefined
    : showEntry.seasons.find(
        (s: SeasonResponse) => s.tmdbId === seasonData.tmdbId
      );
  //to overwrite the possible baseRating.
  const correctedRating: number | undefined = unreleased ? 0 : undefined;
  return {
    ...seasonData,
    showId: showEntry.id,
    country: showEntry.country,
    indexId: indexMedia.id,
    baseRating:
      correctedRating ?? existingSeason?.baseRating ?? seasonData.baseRating,
    rating: correctedRating ?? existingSeason?.rating ?? seasonData.rating,
    voteCount: unreleased
      ? 0
      : (existingSeason?.voteCount ?? seasonData.voteCount),
    dataUpdatedAt: new Date(),
  };
};
