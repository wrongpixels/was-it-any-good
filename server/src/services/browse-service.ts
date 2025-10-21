import { IncludeOptions, Op } from 'sequelize';
import { MediaType } from '../../../shared/types/media';
import { ActiveUser } from '../../../shared/types/models';
import { getActiveUserIncludeOptions } from '../constants/scope-attributes';

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
  //we get the activeUser includeOptions as the base (will be empty array if no user)
  const includeOptions: IncludeOptions[] = getActiveUserIncludeOptions(
    mediaType,
    activeUser
  );
  //we get the includeOptions for the Genres
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
  //and combine them all in the array
  includeOptions.push(genreIncludeOptions);
  /*
  if (mediaType === MediaType.Show) {
    includeOptions.push({
      association: 'seasons',
      attributes: ['rating'],
    });
  }*/
  return includeOptions;
};
