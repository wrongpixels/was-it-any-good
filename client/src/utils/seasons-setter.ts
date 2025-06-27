import { SeasonResponse, ShowResponse } from '../../../shared/types/models';

export const setSeasonsBaseRating = (
  show: ShowResponse
): SeasonResponse[] | null => {
  if (!show.seasons) {
    return null;
  }
  const seasons: SeasonResponse[] = show.seasons.map((s: SeasonResponse) => ({
    ...s,
    baseRating: show.baseRating,
  }));
  return seasons;
};

export const isSpecialSeason = (season: SeasonResponse): boolean =>
  season.index === 0;

export const seasonHasCustomName = (season: SeasonResponse): boolean =>
  season.name !== `Season ${season.index}`;
