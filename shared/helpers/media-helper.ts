import { MediaType } from '../types/media'

export const stringToMediaType = (media: string): MediaType | null => {
  switch (media.toLowerCase()) {
    case 'film':
      return MediaType.Film
    case 'show':
      return MediaType.Show
    case 'season':
      return MediaType.Season
    default:
      return null
  }
}
