import Country from '../countries/countryTypes';
import {
  FilmParental,
  GameParental,
  ShowParental,
} from '../parental/parentalTypes';
import {
  Author,
  Creator,
  Director,
  Individual,
  AuthorType,
  Writer,
  Studio,
  Actor,
  Image,
  Character,
  Cast,
  Direction,
  Studios,
  BirthDate,
  ReleaseDate,
  DefaultMedia,
  MediaRating,
  Writing,
  DefaultFilm,
  MediaType,
  SubMediaType,
  DefaultShow,
  DefaultGame,
  DefaultSeason,
  DefaultDLC,
  DefaultChapter,
} from './mediaTypes';

export const DEF_IMAGE_PERSON: Image = 'https://i.imgur.com/jMiceYX.png';
export const DEF_IMAGE_MEDIA: Image = 'https://i.imgur.com/EYiJVoX.png';

export const DEF_BIRTHDATE: BirthDate = {
  year: 0,
  isUnknown: true,
};
export const DEF_RELEASE_DATE: ReleaseDate = {
  date: null,
  isUnknown: true,
};
export const DEF_MEDIA_RATING: MediaRating = {
  score: 0,
  isValid: true,
  voteCount: 0,
};

export const DEF_INDIVIDUAL: Individual = {
  id: -1,
  name: 'Unknown',
  country: Country.UNKNOWN,
  image: DEF_IMAGE_PERSON,
};

export const DEF_CREATOR: Creator = {
  ...DEF_INDIVIDUAL,
};

export const DEF_AUTHOR: Author = {
  ...DEF_CREATOR,
  type: AuthorType.Unknown,
  birthDate: DEF_BIRTHDATE,
};

export const DEF_DIRECTOR: Director = {
  ...DEF_AUTHOR,
  type: AuthorType.Director,
  name: 'Unknown director',
};

export const DEF_WRITER: Writer = {
  ...DEF_AUTHOR,
  type: AuthorType.Writer,
  name: 'Unknown writer',
};

export const DEF_STUDIO: Studio = {
  ...DEF_INDIVIDUAL,
  name: 'Unknown studio',
};

export const DEF_ACTOR: Actor = {
  ...DEF_AUTHOR,
  type: AuthorType.Actor,
  name: 'Unknown actor',
};

export const DEF_CHARACTER: Character = {
  ...DEF_INDIVIDUAL,
  actor: DEF_ACTOR,
};

export const DEF_CAST: Cast = [DEF_CHARACTER.id];
export const DEF_DIRECTION: Direction = [DEF_DIRECTOR.id];
export const DEF_STUDIOS: Studios = [DEF_STUDIO.id];
export const DEF_WRITING: Writing = [DEF_WRITER.id];
export const DEF_COUNTRIES: Country[] = [Country.UNKNOWN];

export const DEF_MEDIA: DefaultMedia = {
  parentalGuide: FilmParental.UNKNOWN,
  releaseDate: DEF_RELEASE_DATE,
  image: DEF_IMAGE_MEDIA,
  rating: DEF_MEDIA_RATING,
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
  parentalGuide: ShowParental.UNKNOWN,
  type: MediaType.Show,
  subMedia: SubMediaType.Season,
};

export const DEF_GAME: DefaultGame = {
  ...DEF_MEDIA,
  parentalGuide: GameParental.UNKNOWN,
  type: MediaType.Game,
  subMedia: SubMediaType.DLC,
};

export const DEF_SEASON = (parentId: number, index: number): DefaultSeason => ({
  ...DEF_SHOW,
  name: `Season ${index + 1}`,
  sortName: `S${index + 1}`,
  parentId,
  subType: SubMediaType.Season,
  index,
});

export const DEF_DLC = (parentId: number, index: number): DefaultDLC => ({
  ...DEF_GAME,
  name: `DLC ${index + 1}`,
  sortName: `DLC${index + 1}`,
  parentId,
  subType: SubMediaType.DLC,
  index,
});

export const DEF_CHAPTER = (
  parentId: number,
  index: number
): DefaultChapter => ({
  ...DEF_GAME,
  name: `Chapter ${index + 1}`,
  sortName: `CH${index + 1}`,
  parentId,
  subType: SubMediaType.Chapter,
  index,
});
