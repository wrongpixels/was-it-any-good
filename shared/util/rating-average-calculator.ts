//a shared util to calculate a weighted average for a film or show.
//shows take into account each season for the overall calculation.

import { SEASONS_WEIGHT, SHOW_WEIGHT } from '../constants/rating-constants'
import { isIndexMedia, isShow } from '../helpers/media-helper'
import {
  ShowResponse,
  SeasonResponse,
  FilmResponse,
  MediaResponse,
  IndexMediaData,
} from '../types/models'

export const getAnyMediaRating = (
  media: SeasonResponse | IndexMediaData | FilmResponse | ShowResponse,
): number => {
  if (isShow(media)) {
    return calculateShowRating(media) || 0
  }
  //if it's an indexMedia with a show, we pass the nested show

  if (isIndexMedia(media)) {
    if (media.show && isShow(media.show)) {
      return calculateShowRating(media.show) || 0
    }
  }
  //films or regular indexMedia (film/seasons) fall here
  return getRatingInMedia(media) || 0
}

export const getRatingInMedia = (
  media: MediaResponse | SeasonResponse | IndexMediaData,
): number => (media.rating > 0 ? media.rating : media.baseRating)

//their individual ratings into consideration
export const calculateShowRating = (media: ShowResponse): number => {
  const globalAverage: number = getRatingInMedia(media)

  if (!media.seasons || media.seasonCount === 0) {
    return globalAverage
  }
  let validSeasons: SeasonResponse[] = []
  media.seasons.map((s: SeasonResponse) =>
    s.baseRating > 0 || s.rating > 0 ? validSeasons.push(s) : null,
  )
  const seasonsAverage =
    validSeasons.reduce(
      (sum, season) =>
        sum +
        (season.rating !== null && season.rating > 0
          ? Number(season.rating)
          : Number(season.baseRating)),
      0,
    ) / validSeasons.length
  //if the show itself has not been voted, we return the seasons
  if (globalAverage === 0 && seasonsAverage) {
    return seasonsAverage
  }

  return seasonsAverage > 0
    ? globalAverage * SHOW_WEIGHT + seasonsAverage * SEASONS_WEIGHT
    : globalAverage
}
