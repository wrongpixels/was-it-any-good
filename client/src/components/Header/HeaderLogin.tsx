import { useContext } from 'react';
import { LoginData, UserSessionData } from '../../../../shared/types/models';
import { AuthValues, useAuth } from '../../hooks/use-auth';
import { useInputField } from '../../hooks/use-inputfield';
import { useNotification } from '../../hooks/use-notification';
import Button from '../common/Button';
import { AuthContext } from '../../context/AuthContext';

const HeaderLogin = () => {
  const { session } = useContext(AuthContext);
  const loginAlert = useNotification();
  const { login }: AuthValues = useAuth();
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
      onError: (error: Error) => loginAlert.setError(error!.message),
      onSuccess: (data: UserSessionData) => {
        console.log(data);
        loginAlert.setNotification(`welcome, ${data.username}!`);
      },
    });
  };

  if (session) {
    return (
      <div className="absolute right-20 text-amber-100 font-light">
        {session.username}
      </div>
    );
  }

  return (
    <div className="absolute right-20 flex gap-2">
      <div className="relative">
        <form onSubmit={submitLogin} className="flex gap-2">
          {userInput.field}
          {passInput.field}
          <Button size="xs" type="submit" variant="toolbar">
            Login
          </Button>
        </form>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-7">
        {loginAlert.field}
      </div>
    </div>
  );
};

export default HeaderLogin;
