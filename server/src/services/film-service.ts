import { createFilm } from '../factories/film-factory';
import { CreateFilm } from '../models/film';
import MediaRole, { CreateMediaRole } from '../models/mediaRole';
import {
  TMDBAcceptedJobs,
  TMDBCreditsData,
  TMDBCreditsSchema,
  TMDBCrewData,
  TMDBFilmInfoData,
  TMDBFilmData,
  TMDBFilmInfoSchema,
  TMDBRoleData,
} from '../schemas/film-schema';
import { AuthorType, FilmData } from '../types/media/media-types';
import { tmdbAPI } from '../util/config';

export const fetchFilm = async (id: string): Promise<FilmData> => {
  const filmRes = await tmdbAPI.get(`/movie/${id}`);
  const creditsRes = await tmdbAPI.get(`/movie/${id}/credits`);

  const filmInfoData: TMDBFilmInfoData = TMDBFilmInfoSchema.parse(filmRes.data);
  const creditsData: TMDBCreditsData = trimCredits(
    TMDBCreditsSchema.parse(creditsRes.data)
  );
  const filmData: TMDBFilmData = { ...filmInfoData, credits: creditsData };
  const actualFilmData: FilmData = createFilm(filmData);

  return actualFilmData;
};

const trimCredits = (credits: TMDBCreditsData): TMDBCreditsData => ({
  ...credits,
  cast: credits.cast.slice(0, 10),
  crew: credits.crew.filter((crewMember: TMDBCrewData) =>
    Object.values(TMDBAcceptedJobs).includes(crewMember.job as TMDBAcceptedJobs)
  ),
});

export const buildFilm = (filmData: FilmData): CreateFilm => ({
  imdbId: filmData.imdbId,
  tmdbId: filmData.tmdbId,
  name: filmData.name,
  originalName: filmData.originalName,
  sortName: filmData.sortName,
  description: filmData.description,
  status: filmData.status,
  releaseDate: filmData.releaseDate.date || 'Unknown',
  country: filmData.countries,
  image: filmData.image,
  rating: 0,
  voteCount: 0,
  runtime: filmData.runtime,
  parentalGuide: null,
});

const buildCast = (cast: TMDBRoleData[]): void => {
  cast.forEach((p: TMDBRoleData) => buildPersonAndRole(p));
};

const buildPersonAndRole = (person: TMDBRoleData): void => {};

const buildMediaRole = async (roleData: CreateMediaRole): Promise<void> => {
  const mediaRole: MediaRole | null = await getOrCreateMediaRole(roleData);
  if (!mediaRole) {
    return;
  }
  if (mediaRole.role === AuthorType.Actor) {
    if (!roleData.characterName || roleData.characterName.length < 1) {
      return;
    }
    let changed: boolean = false;
    if (!mediaRole.characterName || mediaRole.characterName.length < 1) {
      mediaRole.characterName = roleData.characterName;
      changed = true;
    } else {
      if (!mediaRole.characterName.includes(roleData.characterName[0])) {
        mediaRole.characterName.push(roleData.characterName[0]);
        changed = true;
        console.log(
          `Added character ${roleData.characterName[0]} to Media Role ${mediaRole.id}`
        );
      }
    }
    if (changed) {
      await mediaRole.save();
    }
  }
};

export const getOrCreateMediaRole = async (
  roleData: CreateMediaRole
): Promise<MediaRole | null> => {
  if (!roleData.filmId || !roleData.personId || !roleData.role) {
    return null;
  }
  try {
    const where = {
      filmId: roleData.filmId,
      showId: roleData.showId,
      personId: roleData.personId,
      role: roleData.role,
    };
    const defaults = {
      ...where,
      characterName:
        roleData.role === AuthorType.Actor ? roleData.characterName : undefined,
    };
    const role: [MediaRole, boolean] = await MediaRole.findOrCreate({
      where,
      defaults,
    });
    if (role[1]) {
      console.log(`Created Media Role Entry ${role[0].id}`);
    }
    return role[0];
  } catch (_error) {
    return null;
  }
};
