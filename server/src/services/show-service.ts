import { createShow } from '../factories/show-factory';
import {
  TMDBAcceptedJobs,
  TMDBCreditsData,
  TMDBCreditsSchema,
  TMDBCrewData,
} from '../schemas/film-schema';
import {
  TMDBExternalIdSchema,
  TMDBImdbData,
  TMDBShowData,
  TMDBShowInfoData,
  TMDBShowInfoSchema,
} from '../schemas/show-schema';
import { ShowData } from '../types/media/media-types';
import { tmdbAPI } from '../util/config';

export const fetchShow = async (id: string): Promise<ShowData> => {
  const showRes = await tmdbAPI.get(`/tv/${id}`);
  const creditsRes = await tmdbAPI.get(`/tv/${id}/credits`);
  const externalIdsRes = await tmdbAPI.get(`/tv/${id}/external_ids`);

  const showInfoData: TMDBShowInfoData = TMDBShowInfoSchema.parse(showRes.data);
  const creditsData: TMDBCreditsData = trimCredits(
    TMDBCreditsSchema.parse(creditsRes.data)
  );
  const imdbData: TMDBImdbData = TMDBExternalIdSchema.parse(
    externalIdsRes.data
  );

  const showData: TMDBShowData = {
    ...showInfoData,
    credits: creditsData,
    imdb_id: imdbData.imdb_id,
  };

  const actualShowData: ShowData = createShow(showData);
  return actualShowData;
};

const trimCredits = (credits: TMDBCreditsData): TMDBCreditsData => ({
  ...credits,
  cast: credits.cast.slice(0, 10),
  crew: credits.crew.filter((crewMember: TMDBCrewData) =>
    Object.values(TMDBAcceptedJobs).includes(crewMember.job as TMDBAcceptedJobs)
  ),
});
