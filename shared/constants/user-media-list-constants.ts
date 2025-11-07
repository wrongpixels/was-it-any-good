import { MediaType } from '../types/media'
import { CreateUserMediaList } from '../types/models'

export const MAX_ITEMS_LIST_INDEX: number = 99
export const MAX_USER_LISTS_INDEX: number = 99

export const MAX_LENGTH_NAME: number = 75
export const MIN_LENGTH_NAME: number = 3

export const MAX_LENGTH_DESCRIPTION: number = 150
export const MIN_LENGTH_DESCRIPTION: number = 0

export const DEF_LIST_NEW: CreateUserMediaList = {
  name: 'My New List',
  description: '',
  mediaTypes: [MediaType.Film, MediaType.Show],
  lockedMediaType: false,
  autoCleanItems: false,
  private: false,
  indexInUserLists: -1,
  userId: -1,
  icon: 'multi',
  itemCount: 0,
}

export const DEF_LIST_NEW_FILM: CreateUserMediaList = {
  ...DEF_LIST_NEW,
  name: 'My New Film List',
  mediaTypes: [MediaType.Film],
  lockedMediaType: true,
  icon: 'film',
}

export const DEF_LIST_NEW_SHOW: CreateUserMediaList = {
  ...DEF_LIST_NEW,
  name: 'My New TV List',
  mediaTypes: [MediaType.Show],
  lockedMediaType: true,
  icon: 'show',
}

export const DEF_LIST_LIKES: CreateUserMediaList = {
  name: 'Likes',
  description: 'My Liked Media',
  mediaTypes: [MediaType.Show, MediaType.Film],
  lockedMediaType: true,
  indexInUserLists: 0,
  userId: -1,
  autoCleanItems: true,
  private: false,
  canBeModified: false,
  icon: 'like',
  itemCount: 0,
}

export const DEF_LIST_WATCHLIST: CreateUserMediaList = {
  name: 'Watchlist',
  description: 'What am I watching next?',
  mediaTypes: [MediaType.Film, MediaType.Show, MediaType.Season],
  lockedMediaType: true,
  autoCleanItems: true,
  canBeModified: false,
  private: false,
  indexInUserLists: 1,
  userId: -1,
  icon: 'watchlist',
  itemCount: 0,
}

export const DEF_LIST_FAV_FILMS: CreateUserMediaList = {
  name: 'Favorite Films',
  description: 'My favorite Films',
  mediaTypes: [MediaType.Film],
  lockedMediaType: true,
  indexInUserLists: 2,
  userId: -1,
  autoCleanItems: false,
  canBeModified: false,
  private: false,
  icon: 'fav-film',
  itemCount: 0,
}

export const DEF_LIST_FAV_SHOWS: CreateUserMediaList = {
  name: 'Favorite TV Shows',
  description: 'My favorite TV Shows',
  mediaTypes: [MediaType.Show],
  lockedMediaType: true,
  indexInUserLists: 3,
  userId: -1,
  autoCleanItems: false,
  canBeModified: false,
  private: false,
  icon: 'fav-show',
  itemCount: 0,
}
