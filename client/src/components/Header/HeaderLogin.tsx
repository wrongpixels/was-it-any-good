import { JSX } from 'react';
import Button from '../Common/Custom/Button';
import { useOverlay } from '../../context/OverlayProvider';
import IMG from '../Common/Custom/IMG';
import { DEF_IMAGE_PERSON } from '../../../../shared/defaults/media-defaults';
import { Link } from 'react-router-dom';
import { AuthContextValues } from '../../context/AuthProvider';
import { useAuth } from '../../hooks/use-auth';
import HeaderLoginForm from './HeaderLoginForm';
import { useNotificationContext } from '../../context/NotificationProvider';
import { getByeUserMessage } from '../../../../shared/constants/notification-messages';
import { clientPaths } from '../../../../shared/util/url-builder';

const HeaderLogin = (): JSX.Element => {
  const notification = useNotificationContext();
  const { session, login, logout }: AuthContextValues = useAuth();
  const { openSignUpOverlay } = useOverlay();

  const handleLogout = async () => {
    if (session) {
      notification.setNotification({
        message: getByeUserMessage(session?.username),
      });
    }
    logout();
  };

  if (session) {
    return (
      <div className="flex gap-2 items-center font-normal ">
        <div className="flex items-center gap-4 text-sm ">
          <Link
            to={clientPaths.my.votes.base()}
            aria-label={`View profile for ${session.username}`}
            className="transition-colors flex flex-row gap-2 items-center text-starsearch-bright"
          >
            <IMG
              alt=""
              src={DEF_IMAGE_PERSON}
              className={
                'w-5 rounded border-2 border-gray-300 hover:border-white'
              }
            />
            <span className="font-semibold">{session.username}</span>
          </Link>
          <Button
            size="xs"
            variant="cancel"
            className="border-sky-700 border-1"
            onClick={handleLogout}
          >
            {'Log out'}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex flex-row gap-3 items-center">
        <HeaderLoginForm notification={notification} login={login} />
        <span className="text-xs text-white">{'or'}</span>
        <Button
          size="xs"
          type="submit"
          variant="accept"
          onClick={() => openSignUpOverlay()}
        >
          {'Sign Up'}
        </Button>
      </div>
    </div>
  );
};

export default HeaderLogin;
