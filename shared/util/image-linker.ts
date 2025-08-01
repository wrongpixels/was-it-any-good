import { TMDB_MEDIA_URL } from '../constants/url-constants'
import { DEF_IMAGE_MEDIA, DEF_IMAGE_PERSON } from '../defaults/media-defaults'

const AVATAR_URL: string = `${TMDB_MEDIA_URL}/w138_and_h175_face`
const POSTER_URL: string = `${TMDB_MEDIA_URL}/w220_and_h330_face`
const STUDIO_URL: string = `${TMDB_MEDIA_URL}/w200`
const FULLSIZE_URL: string = `${TMDB_MEDIA_URL}/w500`

const getAvatarImage = (path: string): string => createUrl(path, AVATAR_URL)
const getPosterImage = (path: string): string => createUrl(path, POSTER_URL)
const getStudioImage = (path: string): string => createUrl(path, STUDIO_URL)
const getFullSizeImage = (path: string): string => createUrl(path, FULLSIZE_URL)

const createUrl = (path: string, url: string): string => {
  //if it's one of our defaults, we do nothing
  if (path === DEF_IMAGE_PERSON || path === DEF_IMAGE_MEDIA) {
    return path
  }
  return `${url}${path}`
}

export default {
  getAvatarImage,
  getPosterImage,
  getStudioImage,
  getFullSizeImage,
}
