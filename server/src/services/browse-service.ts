import { IncludeOptions, Op } from 'sequelize';
import { MediaType } from '../../../shared/types/media';

export const buildIncludeOptions = (
  genres: string[] | undefined,
  mediaType: MediaType
): IncludeOptions[] => {
  const include: IncludeOptions[] = [];
  if (genres && genres.length > 0) {
    console.log(genres);
    const genreInclude: IncludeOptions = {
      association: 'genres',
      required: true,
      attributes: ['id', 'name', 'tmdbId'],
      where: {
        id: {
          [Op.in]: genres,
        },
      },
      through: {
        attributes: [],
        where: {
          mediaType,
        },
      },
    };
    include.push(genreInclude);
  }
  return include;
};
