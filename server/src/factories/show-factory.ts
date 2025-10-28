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

export const createIndexForShow = (tmdb: TMDBIndexShow): CreateIndexMedia => ({
  ...createTMDBIndexBase(tmdb),
  name: tmdb.name,
  year: getYearNum(tmdb.first_air_date),
  addedToMedia: false,
  mediaType: MediaType.Show,
  releaseDate: getAirDate(tmdb.first_air_date),
});

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
