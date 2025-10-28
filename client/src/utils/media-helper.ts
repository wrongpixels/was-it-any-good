import dayjs, { Dayjs } from 'dayjs';
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

//to return either the latest season's releaseDate or the show's lastAirDate, whichever
//is newer. This is to show the correct endDate when new season air dates are announced.
export const getNewestAirDate = (media: ShowResponse): string | undefined => {
  if (!media.seasons || media.seasons.length === 0) {
    return undefined;
  }

  const lastSeason: SeasonResponse = media.seasons[media.seasons.length - 1];
  const seasonDate: Dayjs | null = lastSeason.releaseDate
    ? dayjs(lastSeason.releaseDate)
    : null;
  const airDate: Dayjs | null = media.lastAirDate
    ? dayjs(media.lastAirDate)
    : null;

  if (!seasonDate?.isValid() && !airDate?.isValid()) {
    return undefined;
  }
  if (seasonDate?.isValid() && airDate?.isValid()) {
    return seasonDate.isAfter(airDate)
      ? lastSeason.releaseDate!
      : media.lastAirDate!;
  }
  return seasonDate?.isValid() ? lastSeason.releaseDate! : media.lastAirDate!;
};
