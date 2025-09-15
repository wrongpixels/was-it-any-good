import { IncludeOptions, Op } from 'sequelize';
import { MediaType } from '../../../shared/types/media';
import { ActiveUser } from '../../../shared/types/models';
import { getUserRatingIncludeOptions } from '../constants/scope-attributes';

export const buildIncludeOptions = (
  genres: string[] | undefined,
  mediaType: MediaType,
  isFilterPass?: boolean,
  activeUser?: ActiveUser
): IncludeOptions[] => {
  const hasFilters: boolean = !!genres && genres.length > 0;

  //if it's a filter pass and we're not filtering genres, there's no
  //need to include them.
  if (isFilterPass && !hasFilters) {
    return [];
  }
  const includeOptions: IncludeOptions[] = [];
  //we also get the active user's rating for the client
  const includeUserRating: IncludeOptions | undefined =
    getUserRatingIncludeOptions(mediaType, activeUser);
  const genreIncludeOptions: IncludeOptions = {
    association: 'genres',
    attributes: ['id', 'name', 'tmdbId'],
    through: {
      attributes: [],
      where: {
        mediaType,
      },
    },
  };
  if (hasFilters) {
    genreIncludeOptions.where = {
      id: {
        [Op.in]: genres,
      },
    };
  }
  includeOptions.push(genreIncludeOptions);
  if (includeUserRating) {
    includeOptions.push(includeUserRating);
  }
  /*
  if (mediaType === MediaType.Show) {
    includeOptions.push({
      association: 'seasons',
      attributes: ['rating'],
    });
  }*/
  return includeOptions;
};
