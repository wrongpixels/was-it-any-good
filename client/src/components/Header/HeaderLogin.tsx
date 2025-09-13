import { JSX } from 'react';
import Button from '../Common/Custom/Button';
import { useLoginForm } from '../../hooks/use-login-form';
import { InputField } from '../Common/Custom/InputField';
import { styles } from '../../constants/tailwind-styles';
import { useOverlay } from '../../context/OverlayProvider';
import IMG from '../Common/Custom/IMG';
import { DEF_IMAGE_PERSON } from '../../../../shared/defaults/media-defaults';
import { routerPaths } from '../../utils/url-helper';
import { Link } from 'react-router';

const HeaderLogin = (): JSX.Element => {
  const { session, handleLogout, submitLogin, passwordInput, userInput } =
    useLoginForm();

  const { openSignUpOverlay } = useOverlay();

  if (session) {
    return (
      <div className="flex gap-2 items-center font-normal ">
        <div className="flex items-center gap-4 text-sm ">
          <Link
            to={routerPaths.my.votes()}
            className="transition-colors flex flex-row gap-2 items-center text-starsearch-bright hover:text-white"
          >
            <IMG
              src={DEF_IMAGE_PERSON}
              className={'w-5 rounded border-2 border-gray-300'}
            />
            <span className=" font-semibold">{session.username}</span>
          </Link>
          <Button
            size="xs"
            variant="cancel"
            className="border-sky-700 border-1"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex flex-row gap-3 items-center">
        <form onSubmit={submitLogin} className="flex gap-2">
          <InputField
            {...userInput.getProps()}
            className={`w-20 ${styles.inputField.header}`}
          />
          <InputField
            {...passwordInput.getProps()}
            className={`w-20 ${styles.inputField.header}`}
          />
          <Button size="xs" type="submit" variant="toolbar">
            Log In
          </Button>
        </form>
        <span className="text-xs text-white">{'or'}</span>

        <Button
          size="xs"
          type="submit"
          variant="accept"
          onClick={() => openSignUpOverlay()}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default HeaderLogin;
