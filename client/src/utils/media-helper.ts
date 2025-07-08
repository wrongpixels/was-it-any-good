import { SeasonResponse, ShowResponse } from '../../../shared/types/models';

export const addOrReplaceSeason = (
  season: SeasonResponse,
  show: ShowResponse
): ShowResponse => {
  if (!season) return show;

  if (!show.seasons || show.seasons.length < 1) {
    return { ...show, seasonCount: 1, seasons: [season] };
  }

  let seasons: SeasonResponse[] = [...show.seasons];
  const index: number = seasons.findIndex((s) => s.id === season.id);

  if (index === -1) {
    seasons.push(season);
    return { ...show, seasonCount: seasons.length, seasons };
  } else {
    seasons[index] = season;
    return { ...show, seasons };
  }
};
