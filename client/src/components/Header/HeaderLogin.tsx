import { JSX } from 'react';
import Button from '../Common/Custom/Button';
import { useLoginForm } from '../../hooks/use-login-form';
import { InputField } from '../Common/Custom/InputField';
import { styles } from '../../constants/tailwind-styles';
import { useOverlay } from '../../context/OverlayProvider';

const HeaderLogin = (): JSX.Element => {
  const { session, handleLogout, submitLogin, passwordInput, userInput } =
    useLoginForm();

  const { openSignUpOverlay } = useOverlay();

  if (session) {
    return (
      <div className="flex gap-2 items-center font-normal ">
        <div className="flex items-center gap-2  text-sm ">
          <span className="text-gray-100 flex flex-row gap-1">
            @
            <span className="text-amber-100 font-semibold">
              {session.username}
            </span>
          </span>
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
