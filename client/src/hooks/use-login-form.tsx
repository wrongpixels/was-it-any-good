import { APIError } from '../../../shared/types/errors';
import { LoginData, UserSessionData } from '../../../shared/types/models';
import { AuthContextValues } from '../context/AuthProvider';
import { formatToAPIError } from '../utils/error-handler';
import { useAuth } from './use-auth';
import { useInputField } from './use-inputfield';
import { useNotification } from './use-notification';
import { InputFieldHookValues } from '../types/input-field-types';
import { UseNotificationValues } from '../types/notification-types';
import { useNotificationContext } from '../context/NotificationProvider';

interface LoginFormValues {
  session: UserSessionData | null;
  userInput: InputFieldHookValues;
  passwordInput: InputFieldHookValues;
  submitLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  handleLogout: () => void;
  loginNotification: UseNotificationValues;
}

export const useLoginForm = (): LoginFormValues => {
  const { session, login, logout }: AuthContextValues = useAuth();
  const loginNotification: UseNotificationValues = useNotification();
  const newNotification = useNotificationContext();
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
      loginNotification.setError(`User and Password are required!`);
      newNotification.show({ message: 'Test', isError: false, duration: 2000 });
      return;
    }
    if (!loginData.username || !loginData.password) {
      loginNotification.setError(
        `${loginData.username ? 'Username' : 'Password'} cannot be empty`
      );
      newNotification.show({ message: 'Test', isError: false, duration: 2000 });

      return;
    }
    login(loginData, {
      onError: (error: Error) => {
        const apiError: APIError = formatToAPIError(error);
        loginNotification.setError(apiError.message);
      },
      onSuccess: (data: UserSessionData) => {
        loginNotification.setNotification(`Welcome back, ${data.username}!`);
      },
    });
  };

  const handleLogout = () => {
    if (session) {
      loginNotification.setNotification(`See you soon, ${session?.username}!`);
    }
    logout();
  };
  return {
    session,
    userInput,
    passwordInput,
    submitLogin,
    handleLogout,
    loginNotification,
  };
};
