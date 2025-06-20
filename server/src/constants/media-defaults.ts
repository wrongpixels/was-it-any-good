import { CountryCode } from '../../../shared/types/countries';
import { Image } from '../types/media/media-types';
import {
  BirthDate,
  MediaRating,
  IndividualData,
  AuthorData,
  AuthorType,
  StudioData,
  RoleData,
  RoleType,
  DefaultMedia,
  MediaType,
  DefaultFilm,
  SubMediaType,
  DefaultShow,
  DefaultGame,
  DefaultSeason,
  DefaultDLC,
  DefaultChapter,
} from '../types/media/media-types';
import {
  FilmParental,
  ShowParental,
  GameParental,
} from '../types/parental/parental-types';

export const DEF_IMAGE_PERSON: Image = '/def-person.png';
export const DEF_IMAGE_MEDIA: Image = '/def-media.png';

export const DEF_BIRTHDATE: BirthDate = {
  year: 0,
  isUnknown: true,
};
export const DEF_RELEASE_DATE: string = 'Unknown';
export const DEF_MEDIA_RATING: MediaRating = {
  score: 0,
  isValid: true,
  voteCount: 0,
};

export const DEF_INDIVIDUAL: IndividualData = {
  name: 'Unknown',
  country: 'UNKNOWN',
  image: DEF_IMAGE_PERSON,
};

export const DEF_CREATOR: AuthorData = {
  ...DEF_INDIVIDUAL,
  type: AuthorType.Creator,
};

export const DEF_AUTHOR: AuthorData = {
  ...DEF_CREATOR,
  type: AuthorType.Unknown,
  birthDate: DEF_BIRTHDATE,
};

export const DEF_DIRECTOR: AuthorData = {
  ...DEF_AUTHOR,
  type: AuthorType.Director,
  name: 'Unknown Director',
};

export const DEF_WRITER: AuthorData = {
  ...DEF_AUTHOR,
  type: AuthorType.Writer,
  name: 'Unknown Writer',
};
export const DEF_PRODUCER: AuthorData = {
  ...DEF_AUTHOR,
  type: AuthorType.Producer,
  name: 'Unknown Producer',
};

export const DEF_EXEC_PRODUCER: AuthorData = {
  ...DEF_AUTHOR,
  type: AuthorType.ExecProducer,
  name: 'Unknown Executive Producer',
};

export const DEF_COMPOSER: AuthorData = {
  ...DEF_AUTHOR,
  type: AuthorType.MusicComposer,
  name: 'Unknown Composer',
};

export const DEF_STUDIO: StudioData = {
  ...DEF_INDIVIDUAL,
  name: 'Unknown Studio',
};

export const DEF_ACTOR: AuthorData = {
  ...DEF_AUTHOR,
  type: AuthorType.Actor,
  name: 'Unknown Actor',
};

export const DEF_ROLE: RoleData = {
  ...DEF_ACTOR,
  character: 'Unknown',
  order: 1,
  roleType: RoleType.Main,
};

export const DEF_STATUS = 'Released';

export const DEF_CAST: RoleData[] = [DEF_ROLE];
export const DEF_CREW: AuthorData[] = [DEF_DIRECTOR];
export const DEF_STUDIOS: StudioData[] = [DEF_STUDIO];
export const DEF_COUNTRIES: CountryCode[] = ['UNKNOWN'];

export const DEF_MEDIA: DefaultMedia = {
  status: DEF_STATUS,
  parentalGuide: FilmParental.UNKNOWN,
  releaseDate: DEF_RELEASE_DATE,
  image: DEF_IMAGE_MEDIA,
  rating: DEF_MEDIA_RATING,
  runtime: 0,
  baseRating: 0,
  studios: DEF_STUDIOS,
  mediaType: MediaType.Film,
  cast: DEF_CAST,
  crew: DEF_CREW,
  countries: DEF_COUNTRIES,
};

export const DEF_FILM: DefaultFilm = {
  ...DEF_MEDIA,
  parentalGuide: FilmParental.UNKNOWN,
  mediaType: MediaType.Film,
  subMedia: SubMediaType.None,
};

export const DEF_SHOW: DefaultShow = {
  ...DEF_MEDIA,
  crew: [DEF_CREATOR, ...DEF_CREW],
  episodeCount: 0,
  lastAirDate: DEF_RELEASE_DATE,
  parentalGuide: ShowParental.UNKNOWN,
  seasonCount: 1,
  mediaType: MediaType.Show,
  subMedia: SubMediaType.Season,
};

export const DEF_GAME: DefaultGame = {
  ...DEF_MEDIA,
  parentalGuide: GameParental.UNKNOWN,
  mediaType: MediaType.Game,
  subMedia: SubMediaType.DLC,
};

export const DEF_SEASON: DefaultSeason = {
  ...DEF_SHOW,
  name: '',
  sortName: '',
  index: 0,
  subType: SubMediaType.Season,
  genres: [],
};

export const DEF_DLC = (index: number): DefaultDLC => ({
  ...DEF_GAME,
  name: `DLC ${index + 1}`,
  sortName: `DLC${index + 1}`,
  subType: SubMediaType.DLC,
  index,
});

export const DEF_CHAPTER = (index: number): DefaultChapter => ({
  ...DEF_GAME,
  name: `Chapter ${index + 1}`,
  sortName: `CH${index + 1}`,
  subType: SubMediaType.Chapter,
  index,
});
