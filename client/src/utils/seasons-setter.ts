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
