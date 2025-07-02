import { useMutation } from '@tanstack/react-query';
import { CreateRatingData } from '../../../shared/types/models';
import { unvoteMedia, voteMedia } from '../services/ratings-service';

export const voteMutation = () => () =>
  useMutation({
    mutationFn: (rating: CreateRatingData) => voteMedia(rating),
  });

export const unvoteMutation = () =>
  useMutation({
    mutationFn: (mediaId: number) => unvoteMedia(mediaId),
  });
