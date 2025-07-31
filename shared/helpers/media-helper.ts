import { MediaType } from '../types/media'
import { SeasonResponse, ShowResponse } from '../types/models'

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

export const reorderSeasons = (
  show: ShowResponse,
): SeasonResponse[] | undefined =>
  show?.seasons?.sort((a, b) => a.index - b.index)
