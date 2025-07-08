import { JSX } from 'react';
import { LoginData, UserSessionData } from '../../../../shared/types/models';
import { useAuth } from '../../hooks/use-auth';
import { useInputField } from '../../hooks/use-inputfield';
import {
  useNotification,
  UseNotificationValues,
} from '../../hooks/use-notification';
import Button from '../common/Button';
import { AuthContextValues } from '../../context/AuthProvider';
import { formatToAPIError } from '../../utils/error-handler';
import { APIError } from '../../../../shared/types/errors';

const HeaderLogin = (): JSX.Element => {
  const { session, login, logout }: AuthContextValues = useAuth();
  const loginAlert: UseNotificationValues = useNotification();
  const userInput = useInputField({
    label: 'User',
    name: 'username',
    extraLabelClassName: 'text-gray-200',
    extraClassNames: 'w-20',
  });
  const passInput = useInputField({
    label: 'Password',
    name: 'password',
    type: 'password',
    extraLabelClassName: 'text-gray-200',
    extraClassNames: 'w-20',
  });

  const submitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginData: LoginData = {
      username: userInput.value,
      password: passInput.value,
    };
    if (!loginData.username && !loginData.password) {
      loginAlert.setError(`User and Password are required!`);
      return;
    }
    if (!loginData.username || !loginData.password) {
      loginAlert.setError(
        `${loginData.username ? 'Username' : 'Password'} cannot be empty`
      );
      return;
    }
    login(loginData, {
      onError: (error: Error) => {
        const apiError: APIError = formatToAPIError(error);
        loginAlert.setError(apiError.message);
      },
      onSuccess: (data: UserSessionData) => {
        loginAlert.setNotification(`Welcome back, ${data.username}!`);
      },
    });
  };

  const handleLogout = () => {
    if (session) {
      loginAlert.setNotification(`See you soon, ${session?.username}!`);
    }
    logout();
  };

  const loginNotification = (): JSX.Element => (
    <div className="absolute left-1/2 -translate-x-1/2 top-7 min-w-40">
      {loginAlert.field}
    </div>
  );
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
    <div className="absolute right-20 flex gap-2 items-center">
      <div className="relative">
        <form onSubmit={submitLogin} className="flex gap-2 ">
          {userInput.field}
          {passInput.field}
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
