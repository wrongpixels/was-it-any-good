import { DEF_CREATOR, DEF_SEASON, DEF_SHOW } from '../constants/media-defaults';
import { SeasonData, AuthorData, ShowData } from '../types/media/media-types';
import {
  createCrewMember,
  createTMDBIndexBase,
  createTMDBMediaBase,
  getAirDate,
} from './media-factory';
import {
  TMDBCreatorData,
  TMDBSeasonData,
  TMDBShowData,
} from '../schemas/tmdb-show-schema';
import { TMDBIndexShow } from '../schemas/tmdb-index-media-schemas';
import { MediaType } from '../../../shared/types/media';
import { CreateIndexMedia } from '../../../shared/types/models';
import { getYearNum } from '../../../shared/helpers/format-helper';
import { isUnreleased } from '../../../shared/helpers/media-helper';

export const createShow = (tmdb: TMDBShowData): ShowData => {
  //we filter out seasons with null releaseDates or invalid ones.
  //those mean not released + not enough data created.
  const seasons = createSeasons(tmdb).filter((s: SeasonData) => {
    if (!s.releaseDate) {
      return false;
    }
    const date = new Date(s.releaseDate);
    if (isNaN(date.getTime())) {
      return false;
    }
    return true;
  });
  return {
    ...DEF_SHOW,
    ...createTMDBMediaBase(tmdb),
    name: tmdb.name,
    sortName: tmdb.name.trim(),
    episodeCount: tmdb.number_of_episodes,
    seasonCount: seasons.length,
    originalName: tmdb.original_name,
    releaseDate: getAirDate(tmdb.first_air_date),
    lastAirDate: getAirDate(tmdb.last_air_date),
    runtime: tmdb.episode_run_time[0],
    seasons,
  };
};

export const createIndexForShow = (tmdb: TMDBIndexShow): CreateIndexMedia => {
  //to avoid adding a baseRating because of TMDB for some reason allowing people to vote before
  //release date, we have to do all this.
  const releaseDate: string | null = getAirDate(tmdb.first_air_date);
  const unreleased: boolean = isUnreleased(releaseDate);
  //to overwrite the possible baseRating.

  const base = createTMDBIndexBase(tmdb);
  const correctedRating: number | undefined = unreleased ? 0 : undefined;
  return {
    ...base,
    name: tmdb.name,
    year: getYearNum(releaseDate),
    addedToMedia: false,
    mediaType: MediaType.Show,
    releaseDate,
    baseRating: correctedRating ?? base.baseRating,
    rating: correctedRating ?? base.rating,
    voteCount: unreleased ? 0 : base.voteCount,
  };
};

export const createIndexForShowBulk = (
  tmdbs: TMDBIndexShow[]
): CreateIndexMedia[] => tmdbs.map((t: TMDBIndexShow) => createIndexForShow(t));

export const createCreators = (creators: TMDBCreatorData[]): AuthorData[] =>
  creators.map((c: TMDBCreatorData) => createCreator(c));

const createCreator = (creator: TMDBCreatorData): AuthorData => ({
  ...DEF_CREATOR,
  ...createCrewMember({
    ...creator,
    job: 'Creator',
    department: 'Creator',
  }),
});

const createSeasons = (show: TMDBShowData): SeasonData[] =>
  show.seasons.map((s: TMDBSeasonData) => createSeason(s, show.poster_path));

const createSeason = (
  season: TMDBSeasonData,
  showPoster: string | null
): SeasonData => ({
  ...DEF_SEASON,
  name: season.name,
  originalName: season.name,
  index: season.season_number,
  sortName: season.name,
  baseRating: season.vote_average,
  voteCount: season.vote_average > 0 ? 1 : 0,
  rating: season.vote_average || 0,
  tmdbId: season.id,
  episodeCount: season.episode_count,
  description: season.overview || '',
  image: season.poster_path
    ? season.poster_path
    : showPoster
      ? showPoster
      : DEF_SHOW.image,
  releaseDate: getAirDate(season.air_date),
});
