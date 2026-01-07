import {
  NOTI_MISSING_USER_AND_PASSWORD,
  getMissingUserOrPasswordMessage,
  getWelcomeUserMessage,
} from '../../../../shared/constants/notification-messages';
import { APIError } from '../../../../shared/types/errors';
import { LoginData, UserSessionData } from '../../../../shared/types/models';
import { styles } from '../../constants/tailwind-styles';
import { NotificationContextValues } from '../../context/NotificationProvider';
import { useInputField } from '../../hooks/use-input-field';
import { InputFieldHookValues } from '../../types/input-field-types';
import { formatToAPIError } from '../../utils/error-handler';
import Button from '../Common/Custom/Button';
import { InputField } from '../Common/Custom/InputField';

interface HeaderLoginFormProps {
  notification: NotificationContextValues;
  login: (
    data: LoginData,
    options?: {
      onSuccess?: (data: UserSessionData) => void;
      onError?: (error: Error) => void;
    }
  ) => void;
}

const HeaderLoginForm = ({ notification, login }: HeaderLoginFormProps) => {
  const userInput: InputFieldHookValues = useInputField({
    name: 'username',
    placeholder: 'User',
    autoComplete: 'username',
    rules: {
      minLength: 4,
      maxLength: 20,
    },
  });
  const passwordInput: InputFieldHookValues = useInputField({
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    autoComplete: 'current-password',
    rules: {
      minLength: 8,
      maxLength: 72,
    },
  });

  const submitLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const loginData: LoginData = {
      username: userInput.value,
      password: passwordInput.value,
    };
    if (!loginData.username && !loginData.password) {
      notification.setError({
        message: NOTI_MISSING_USER_AND_PASSWORD,
      });
      return;
    }
    if (!loginData.username || !loginData.password) {
      notification.setError({
        message: getMissingUserOrPasswordMessage(loginData.username),
      });
      return;
    }
    login(loginData, {
      onError: (error: Error) => {
        const apiError: APIError = formatToAPIError(error);
        notification.setError({
          message: apiError.message,
        });
      },
      onSuccess: async (data: UserSessionData) => {
        notification.setNotification({
          message: getWelcomeUserMessage(data.username),
        });
      },
    });
  };

  return (
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
        {'Log In'}
      </Button>
    </form>
  );
};

export default HeaderLoginForm;
