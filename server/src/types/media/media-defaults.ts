import Country from '../countries/country-types';
import {
  FilmParental,
  GameParental,
  ShowParental,
} from '../parental/parentaly-types';
import {
  AuthorData,
  CreatorData,
  DirectorData,
  IndividualData,
  AuthorType,
  WriterData,
  StudioData,
  ActorData,
  Image,
  RoleData,
  BirthDate,
  AirDate,
  DefaultMedia,
  MediaRating,
  DefaultFilm,
  MediaType,
  SubMediaType,
  DefaultShow,
  DefaultGame,
  DefaultSeason,
  DefaultDLC,
  DefaultChapter,
  RoleType,
} from './media-types';

export const DEF_IMAGE_PERSON: Image = 'https://i.imgur.com/jMiceYX.png';
export const DEF_IMAGE_MEDIA: Image = 'https://i.imgur.com/EYiJVoX.png';

export const DEF_BIRTHDATE: BirthDate = {
  year: 0,
  isUnknown: true,
};
export const DEF_RELEASE_DATE: AirDate = {
  date: null,
  isUnknown: true,
};
export const DEF_MEDIA_RATING: MediaRating = {
  score: 0,
  isValid: true,
  voteCount: 0,
};

export const DEF_INDIVIDUAL: IndividualData = {
  name: 'Unknown',
  country: Country.UNKNOWN,
  image: DEF_IMAGE_PERSON,
};

export const DEF_CREATOR: CreatorData = {
  ...DEF_INDIVIDUAL,
  type: AuthorType.Creator,
};

export const DEF_AUTHOR: AuthorData = {
  ...DEF_CREATOR,
  type: AuthorType.Unknown,
  birthDate: DEF_BIRTHDATE,
};

export const DEF_DIRECTOR: DirectorData = {
  ...DEF_AUTHOR,
  type: AuthorType.Director,
  name: 'Unknown director',
};

export const DEF_WRITER: WriterData = {
  ...DEF_AUTHOR,
  type: AuthorType.Writer,
  name: 'Unknown writer',
};

export const DEF_STUDIO: StudioData = {
  ...DEF_INDIVIDUAL,
  name: 'Unknown studio',
};

export const DEF_ACTOR: ActorData = {
  ...DEF_AUTHOR,
  type: AuthorType.Actor,
  name: 'Unknown actor',
};

export const DEF_ROLE: RoleData = {
  ...DEF_INDIVIDUAL,
  character: 'Unknown',
  roleType: RoleType.Unknown,
};

export const DEF_STATUS = 'Released';

export const DEF_CAST: RoleData[] = [DEF_ROLE];
export const DEF_DIRECTION: DirectorData[] = [DEF_DIRECTOR];
export const DEF_STUDIOS: StudioData[] = [DEF_STUDIO];
export const DEF_WRITING: WriterData[] = [DEF_WRITER];
export const DEF_COUNTRIES: Country[] = [Country.UNKNOWN];

export const DEF_MEDIA: DefaultMedia = {
  status: DEF_STATUS,
  parentalGuide: FilmParental.UNKNOWN,
  releaseDate: DEF_RELEASE_DATE,
  image: DEF_IMAGE_MEDIA,
  rating: DEF_MEDIA_RATING,
  runtime: 0,
  studios: DEF_STUDIOS,
  directors: DEF_DIRECTION,
  writers: DEF_WRITING,
  countries: DEF_COUNTRIES,
  cast: DEF_CAST,
};

export const DEF_FILM: DefaultFilm = {
  ...DEF_MEDIA,
  parentalGuide: FilmParental.UNKNOWN,
  type: MediaType.Film,
  subMedia: SubMediaType.None,
};

export const DEF_SHOW: DefaultShow = {
  ...DEF_MEDIA,
  episodeCount: 0,
  creators: [DEF_CREATOR],
  lastAirDate: DEF_RELEASE_DATE,
  parentalGuide: ShowParental.UNKNOWN,
  seasonCount: 1,
  type: MediaType.Show,
  subMedia: SubMediaType.Season,
};

export const DEF_GAME: DefaultGame = {
  ...DEF_MEDIA,
  parentalGuide: GameParental.UNKNOWN,
  type: MediaType.Game,
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
