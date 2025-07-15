import { JSX } from 'react';
import { APIError } from '../../../shared/types/errors';
import { LoginData, UserSessionData } from '../../../shared/types/models';
import { AuthContextValues } from '../context/AuthProvider';
import { formatToAPIError } from '../utils/error-handler';
import { useAuth } from './use-auth';
import { useInputField } from './use-inputfield';
import { UseNotificationValues, useNotification } from './use-notification';
import { InputFieldHookValues } from '../types/input-field-types';

interface LoginFormValues {
  session: UserSessionData | null;
  userInput: InputFieldHookValues;
  passwordInput: InputFieldHookValues;
  submitLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  handleLogout: () => void;
  loginNotification: () => JSX.Element;
}

export const useLoginForm = (): LoginFormValues => {
  const { session, login, logout }: AuthContextValues = useAuth();
  const loginAlert: UseNotificationValues = useNotification();
  const userInput: InputFieldHookValues = useInputField({
    label: 'User',
    name: 'username',
  });
  const passwordInput: InputFieldHookValues = useInputField({
    label: 'Password',
    name: 'password',
    type: 'password',
  });

  const submitLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const loginData: LoginData = {
      username: userInput.value,
      password: passwordInput.value,
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

  return {
    session,
    userInput,
    passwordInput,
    submitLogin,
    handleLogout,
    loginNotification,
  };
};
