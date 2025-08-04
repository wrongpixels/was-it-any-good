import { JSX } from 'react';
import Button from '../common/Button';
import { useLoginForm } from '../../hooks/use-login-form';
import { InputField } from '../common/InputField';
import { styles } from '../../constants/tailwind-styles';

const HeaderLogin = (): JSX.Element => {
  const { session, handleLogout, submitLogin, passwordInput, userInput } =
    useLoginForm();

  if (session) {
    return (
      <div className="flex gap-2 items-center text-amber-100 font-normal">
        <div className="flex items-center gap-2 text-sm">
          {session.username}
          <Button
            size="xs"
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
      <div className="relative">
        <form onSubmit={submitLogin} className="flex gap-2">
          <InputField
            {...userInput.getProps()}
            className={`w-20 ${styles.inputField.header}`}
            labelClassName="text-gray-200"
          />
          <InputField
            {...passwordInput.getProps()}
            className={`w-20 ${styles.inputField.header}`}
            labelClassName="text-gray-200"
          />
          <Button size="xs" type="submit" variant="toolbar">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HeaderLogin;
