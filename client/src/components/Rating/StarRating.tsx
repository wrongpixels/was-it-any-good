import HoverMessage from '../notifications/HoverMessage';
import { MediaType } from '../../../../shared/types/media';
import StarList from './StarList';
import { DEF_STAR_WIDTH } from '../../constants/ratings-constants';
import { JSX } from 'react';
import { useRatingInteractions } from '../../hooks/use-rating-interaction';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';
import {
  NotificationContextValues,
  useNotificationContext,
} from '../../context/NotificationProvider';
import { LOW_NOTIFICATION } from '../../constants/notification-constants';

interface StarRatingProps {
  readonly starWidth?: number;
  readonly defaultRating?: number;
  readonly media: MediaResponse | SeasonResponse;
}

const StarRating = ({
  starWidth = DEF_STAR_WIDTH,
  defaultRating = 0,
  media,
}: StarRatingProps): JSX.Element => {
  const { mediaType, userRating = null }: MediaResponse | SeasonResponse =
    media;
  const { setNotification, anchorRef }: NotificationContextValues =
    useNotificationContext();

  const sendPosterNotification = (message: string) => {
    setNotification({ message, offset: LOW_NOTIFICATION, anchorRef });
  };

  const { state, handlers, display } = useRatingInteractions(
    media,
    starWidth,
    sendPosterNotification,
    defaultRating
  );

  return (
    <div className="flex flex-col items-center mt-1">
      <div
        className={`relative ${mediaType === MediaType.Season ? 'h-6' : 'h-7'} cursor-pointer flex`}
        onMouseMove={handlers.handleMouseMove}
        onMouseLeave={handlers.handleMouseLeave}
        onClick={handlers.handleClick}
      >
        <span className="w-4" />
        <div className="relative">
          <div className="text-gray-300" ref={anchorRef}>
            <StarList
              width={starWidth}
              justVoted={false}
              defaultRating={defaultRating}
              userRating={userRating?.userScore}
            />
          </div>
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: display.starsFillPercentage }}
          >
            <div className={display.starsColor}>
              <StarList
                interactive={!state.isLocked}
                width={starWidth}
                justVoted={false}
                defaultRating={defaultRating}
                userRating={userRating?.userScore}
              />
            </div>
            {state.justVoted && (
              <div
                className={`absolute top-0 left-0 overflow-hidden ${display.votingStarsColor}`}
              >
                <StarList
                  width={starWidth}
                  justVoted={true}
                  defaultRating={defaultRating}
                  userRating={display.scoreToDisplay}
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-4" />
      </div>
      {state.isHovering && <HoverMessage message={display.hoverMessage} />}
    </div>
  );
};
export default StarRating;
