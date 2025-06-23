import { useInputField } from '../hooks/input-field';
import { useNotification } from '../hooks/useNotification';
import Button from './common/Button';
import { StarIcon } from './Rating/StarIcons';

const Header = () => {
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
    <div>
      <div className="h-10 bg-[#5980c7] sticky shadow-sm top-0 flex justify-center items-center">
        <div className="font-bold text-white text-2xl flex items-center pb-1">
          WI
          <span className="inline-flex items-center -mx-[2px] text-staryellow">
            <StarIcon width={27} />
          </span>
          G
          <span className="font-normal italic ml-2 text-base mt-1">
            | Was It Any Good
          </span>
          <span className="font-medium italic ml-0.5 text-xl mt-1">?</span>
        </div>

        <div className="absolute right-20 flex gap-2">
          <div className="relative">
            <div className="flex gap-2">
              {userInput.field}
              {passInput.field}
              <Button
                size="xs"
                variant="toolbar"
                onClick={() =>
                  loginAlert.setError('Error: Wrong user or password!', 5000)
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
      </div>
    </div>
  );
};

export default Header;
