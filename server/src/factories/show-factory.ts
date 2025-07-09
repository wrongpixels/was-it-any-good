import imageLinker from '../services/image-linker';

import { DEF_CREATOR, DEF_SEASON, DEF_SHOW } from '../constants/media-defaults';
import { SeasonData, AuthorData, ShowData } from '../types/media/media-types';
import {
  createCrewMember,
  createTMDBMediaBase,
  getAirDate,
} from './media-factory';
import {
  TMDBCreatorData,
  TMDBSeasonData,
  TMDBShowData,
} from '../schemas/tmdb-show-schema';

export const createShow = (tmdb: TMDBShowData): ShowData => ({
  ...DEF_SHOW,
  ...createTMDBMediaBase(tmdb),
  name: tmdb.name,
  sortName: tmdb.name.trim(),
  episodeCount: tmdb.number_of_episodes,
  seasonCount: tmdb.number_of_seasons,
  originalName: tmdb.original_name,
  releaseDate: getAirDate(tmdb.first_air_date),
  lastAirDate: getAirDate(tmdb.last_air_date),
  runtime: tmdb.episode_run_time[0],
  seasons: createSeasons(tmdb.seasons),
});

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

const createSeasons = (seasons: TMDBSeasonData[]): SeasonData[] =>
  seasons.map((s: TMDBSeasonData) => createSeason(s));

const createSeason = (season: TMDBSeasonData): SeasonData => ({
  ...DEF_SEASON,
  name: season.name,
  originalName: season.name,
  index: season.season_number,
  sortName: season.name,
  baseRating: season.vote_average,
  tmdbId: season.id,
  episodeCount: season.episode_count,
  description: season.overview || '',
  image: season.poster_path
    ? imageLinker.createPosterURL(season.poster_path)
    : DEF_SHOW.image,
  releaseDate: getAirDate(season.air_date),
});
