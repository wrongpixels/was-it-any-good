import { IncludeOptions, Op } from 'sequelize';
import { MediaType } from '../../../shared/types/media';

export const buildIncludeOptions = (
  genres: string[] | undefined,
  mediaType: MediaType,
  isFilterPass?: boolean
): IncludeOptions[] => {
  const hasFilters: boolean = !!genres && genres.length > 0;

  //if it's a filter pass and we're not filtering genres, there's no
  //need to include them.
  if (isFilterPass && !hasFilters) {
    return [];
  }
  const includeOptions: IncludeOptions[] = [];
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
  /*
  if (mediaType === MediaType.Show) {
    includeOptions.push({
      association: 'seasons',
      attributes: ['rating'],
    });
  }*/
  return includeOptions;
};
