import { useState } from 'react';
import { UserVote } from '../../../shared/types/common';
import { MediaType } from '../../../shared/types/media';
import {
  DEF_NOTIFICATION_DURATION,
  LOW_NOTIFICATION,
} from '../constants/notification-constants';
import { PADDING_ADJUSTER } from '../constants/ratings-constants';
import { numToVote } from '../utils/ratings-helper';
import { useNotification } from './use-notification';
import { useAuth } from './use-auth';
import { useNotificationContext } from '../context/NotificationProvider';

export const useRatingInteraction = (
  userRating: UserVote | undefined,
  handleVote: (rating: UserVote) => void,
  handleUnvote: () => void,
  mediaType: MediaType,
  starWidth: number
) => {
  const [hoverRating, setHoverRating]: [
    UserVote,
    React.Dispatch<React.SetStateAction<UserVote>>,
  ] = useState<UserVote>(UserVote.None);
  const [isHovering, setIsHovering]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState<boolean>(false);
  const [needToLeave, setNeedToLeave]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState<boolean>(false);
  const [justVoted, setJustVoted]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useState<boolean>(false);
  const notification = useNotification();
  const { show } = useNotificationContext();
  const { session } = useAuth();

  const calculateNewRating = (x: number, width: number): UserVote => {
    const starsWidth: number = starWidth * 5;
    const paddingWidth: number = width - starsWidth;
    const adjustedX: number = x + PADDING_ADJUSTER - paddingWidth / 2;
    const rating: number = Math.round((adjustedX / starsWidth) * 10);

    if (rating <= 0) {
      return userRating !== undefined && userRating !== UserVote.None
        ? UserVote.Unvote
        : UserVote.One;
    }

    return numToVote(rating);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const container: EventTarget & HTMLDivElement = e.currentTarget;
    const { left, width }: DOMRect = container.getBoundingClientRect();
    const x: number = e.clientX - left;
    const newRating: UserVote = calculateNewRating(x, width);
    if (needToLeave) {
      return;
    }
    setHoverRating(newRating);
    setIsHovering(true);
  };

  const handleClick = (): void => {
    if (needToLeave) {
      return;
    }
    if (!session || session.expired || !session.userId) {
      show({
        message: 'You have to login to vote!',
        isError: false,
        duration: DEF_NOTIFICATION_DURATION,
        anchorRef: notification.anchorRef,
      });
      notification.setNotification(
        'You have to login to vote!',
        DEF_NOTIFICATION_DURATION,
        LOW_NOTIFICATION
      );
      return;
    }
    if (hoverRating === UserVote.Unvote || userRating === hoverRating) {
      if (userRating) {
        notification.setNotification(
          `Unvoted ${mediaType}`,
          DEF_NOTIFICATION_DURATION,
          LOW_NOTIFICATION
        );
        handleUnvote();
      }
    } else if (hoverRating) {
      notification.setNotification(
        `Voted ${mediaType}\nwith a ${hoverRating}!`,
        DEF_NOTIFICATION_DURATION,
        LOW_NOTIFICATION
      );
      handleVote(hoverRating);
      setJustVoted(true);
      setTimeout(() => setJustVoted(false), 200);
    }
    setIsHovering(false);
    setNeedToLeave(true);
  };

  const handleMouseLeave = (): void => {
    setHoverRating(UserVote.None);
    setIsHovering(false);
    setNeedToLeave(false);
  };

  return {
    hoverRating,
    isHovering,
    justVoted,
    handleMouseMove,
    handleClick,
    handleMouseLeave,
    notification,
  };
};
