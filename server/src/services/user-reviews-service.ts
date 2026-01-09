import { isUnreleased } from '../../../shared/helpers/media-helper';
import {
  CreateUserReview,
  CreateUserReviewData,
} from '../../../shared/types/models';
import { IndexMedia, Rating, UserReview } from '../models';
import CustomError, { NotFoundError } from '../util/customError';

export const createUserReview = async (
  reviewData: CreateUserReviewData,
  indexId: number,
  userId: number
): Promise<UserReview> => {
  //we get the media to verify it exists in the db.
  //we also look for any existing rating by the user for that media.
  //we get just the ids as we don't need the rest of full entries.
  const [media, rating]: [IndexMedia | null, Rating | null] = await Promise.all(
    [
      //for the media, we also get the releaseDate.
      IndexMedia.findByPk(indexId, {
        attributes: ['id', 'releaseDate'],
      }),
      Rating.findOne({
        where: {
          userId,
          indexId,
        },
        attributes: ['id'],
      }),
    ]
  );

  //if no media found, the id is wrong and we do not allow for the review
  //to be published.
  //rating can be null, as we allow users to unvote or review without voting.
  if (!media) {
    throw new NotFoundError('Media does not exist.');
  }

  //if the media is not released yet, the user cannot vote.
  if (isUnreleased(media.releaseDate)) {
    throw new CustomError(
      'This media has not been released yet, so it cannot be reviewed.',
      409,
      'ConflictError',
      'MEDIA_UNRELEASED'
    );
  }
  //if we found an existing Rating, we extract its id.
  const ratingId: number | null = rating?.id || null;

  //and now, we have all the info to post the review.
  const createReview: CreateUserReview = {
    ...reviewData,
    userId,
    indexId,
    ratingId,
  };
  const newReviewEntry: UserReview = await UserReview.create(createReview);
  return newReviewEntry;
};
