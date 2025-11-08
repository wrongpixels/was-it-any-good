//a shared util to calculate a weighted average for a film or show.
//shows take into account each season for the overall calculation.

import { SEASONS_WEIGHT, SHOW_WEIGHT } from '../constants/rating-constants'
import {
  ShowResponse,
  SeasonResponse,
  MediaResponse,
  IndexMediaData,
} from '../types/models'
export const getMediaCurrentRating = (
  media: MediaResponse | SeasonResponse | IndexMediaData,
): number => (media.rating > 0 ? media.rating : media.baseRating)

export const calculateAverage = (
  media: MediaResponse | SeasonResponse | IndexMediaData,
): number => {
  const globalAverage: number = getMediaCurrentRating(media)
  return Math.round(globalAverage * 10) / 10
}

//their individual ratings into consideration
export const calculateShowAverage = (media: ShowResponse): number => {
  const globalAverage: number = calculateAverage(media)

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
