import { APIError } from '../../../shared/types/errors';
import { LoginData, UserSessionData } from '../../../shared/types/models';
import { AuthContextValues } from '../context/AuthProvider';
import { formatToAPIError } from '../utils/error-handler';
import { useAuth } from './use-auth';
import { useInputField } from './use-inputfield';
import { InputFieldHookValues } from '../types/input-field-types';
import { useNotificationContext } from '../context/NotificationProvider';

interface LoginFormValues {
  session: UserSessionData | null;
  userInput: InputFieldHookValues;
  passwordInput: InputFieldHookValues;
  submitLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  handleLogout: () => void;
}

export const useLoginForm = (): LoginFormValues => {
  const { session, login, logout }: AuthContextValues = useAuth();

  const loginNotification = useNotificationContext();
  const userInput: InputFieldHookValues = useInputField({
    name: 'username',
    placeholder: 'User',
  });
  const passwordInput: InputFieldHookValues = useInputField({
    name: 'password',
    placeholder: 'Password',
    type: 'password',
  });

  const submitLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const loginData: LoginData = {
      username: userInput.value,
      password: passwordInput.value,
    };
    if (!loginData.username && !loginData.password) {
      loginNotification.setError({
        message: 'User and Password are required!',
      });
      return;
    }
    if (!loginData.username || !loginData.password) {
      loginNotification.setError({
        message: `${loginData.username ? 'Username' : 'Password'} cannot be empty`,
      });
      return;
    }
    login(loginData, {
      onError: (error: Error) => {
        const apiError: APIError = formatToAPIError(error);
        loginNotification.setError({
          message: apiError.message,
        });
      },
      onSuccess: async (data: UserSessionData) => {
        loginNotification.setNotification({
          message: `Welcome back, ${data.username}!`,
        });
      },
    });
  };

  const handleLogout = async () => {
    if (session) {
      loginNotification.setNotification({
        message: `See you soon, ${session?.username}!`,
      });
    }
    logout();
  };
  return {
    session,
    userInput,
    passwordInput,
    submitLogin,
    handleLogout,
  };
};
