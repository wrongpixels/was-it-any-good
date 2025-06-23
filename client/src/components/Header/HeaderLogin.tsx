import { useInputField } from '../../hooks/use-inputfield';
import { useNotification } from '../../hooks/use-notification';
import Button from '../common/Button';

const HeaderLogin = () => {
  const loginAlert = useNotification();
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
  return (
    <div className="absolute right-20 flex gap-2">
      <div className="relative">
        <div className="flex gap-2">
          {userInput.field}
          {passInput.field}
          <Button
            size="xs"
            variant="toolbar"
            onClick={() =>
              loginAlert.setError('Error: Wrong user or password!')
            }
          >
            Login
          </Button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-7">
          {loginAlert.field}
        </div>
      </div>
    </div>
  );
};

export default HeaderLogin;
