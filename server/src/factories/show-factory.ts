import imageLinker from '../services/image-linker';
import { mapTMDBGenres } from '../services/genre-mapper';
import {
  DEF_CREATOR,
  DEF_FILM,
  DEF_SEASON,
  DEF_SHOW,
} from '../types/media/media-defaults';
import {
  SeasonData,
  AuthorData,
  ShowData,
  SubMediaType,
} from '../types/media/media-types';
import {
  createCast,
  createDirectors,
  createStudios,
  createWriters,
  getAirDate,
  validateCountries,
} from './media-factory';
import {
  TMDBCreatorData,
  TMDBSeasonData,
  TMDBShowData,
} from '../schemas/show-schema';

export const createShow = (tmdb: TMDBShowData): ShowData => ({
  ...DEF_SHOW,
  tmdbId: tmdb.id.toString(),
  imdbId: tmdb.imdb_id,
  name: tmdb.name,
  sortName: tmdb.name.trim(),
  episodeCount: tmdb.number_of_episodes,
  seasonCount: tmdb.number_of_seasons,
  countries: validateCountries(tmdb.origin_country),
  originalName: tmdb.original_name,
  description: tmdb.overview,
  releaseDate: getAirDate(tmdb.first_air_date),
  lastAirDate: getAirDate(tmdb.last_air_date),
  image: tmdb.poster_path
    ? imageLinker.createPosterURL(tmdb.poster_path)
    : DEF_FILM.image,
  runtime: tmdb.episode_run_time[0],
  genres: mapTMDBGenres(tmdb.genres),
  creators: createCreators(tmdb.created_by),
  directors: createDirectors(tmdb.credits.crew),
  writers: createWriters(tmdb.credits.crew),
  cast: createCast(tmdb.credits.cast),
  studios: createStudios(tmdb.production_companies),
  seasons: createSeasons(tmdb.seasons),
});

const createCreators = (creators: TMDBCreatorData[]): AuthorData[] =>
  creators.map((c: TMDBCreatorData) => createCreator(c));

const createCreator = (creator: TMDBCreatorData): AuthorData => ({
  ...DEF_CREATOR,
  name: creator.name,
  tmdbId: creator.id.toString(),
  image: creator.profile_path ? creator.profile_path : DEF_CREATOR.image,
});

const createSeasons = (seasons: TMDBSeasonData[]): SeasonData[] =>
  seasons.map((s: TMDBSeasonData) => createSeason(s));

const createSeason = (season: TMDBSeasonData): SeasonData => ({
  ...DEF_SEASON,
  name: season.name,
  originalName: season.name,
  index: season.season_number,
  sortName: season.name,
  tmdbId: season.id.toString(),
  episodeCount: season.episode_count,
  description: season.overview || '',
  image: season.poster_path
    ? imageLinker.createPosterURL(season.poster_path)
    : DEF_SHOW.image,
  releaseDate: getAirDate(season.air_date),
  subType: SubMediaType.Season,
});
