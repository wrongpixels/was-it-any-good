import { JSX } from 'react';
import Button from '../common/Button';
import { useLoginForm } from '../../hooks/use-login-form';
import { InputField } from '../common/InputField';

const HeaderLogin = (): JSX.Element => {
  const {
    session,
    handleLogout,
    submitLogin,
    loginNotification,
    passwordInput,
    userInput,
  } = useLoginForm();
  if (session) {
    return (
      <div className="absolute right-20 text-amber-100 font-normal">
        <div className="flex items-center gap-2 text-sm">
          {session.username}
          <Button size="xs" variant="primary" onClick={handleLogout}>
            Log out
          </Button>
        </div>
        {loginNotification()}
      </div>
    );
  }
  return (
    <div className="flex gap-2 items-center">
      <div className="relative">
        <form onSubmit={submitLogin} className="flex gap-2 ">
          <InputField
            {...userInput.getProps()}
            className="w-30"
            labelClassName="text-gray-200"
          />
          <InputField
            {...passwordInput.getProps()}
            className="w-30"
            labelClassName="text-gray-200"
          />
          <Button size="xs" type="submit" variant="toolbar">
            Login
          </Button>
        </form>
      </div>
      {loginNotification()}
    </div>
  );
};

export default HeaderLogin;
