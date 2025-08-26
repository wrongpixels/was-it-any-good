import { useInputField } from '../../hooks/use-inputfield';
import Button from '../common/Button';
import CreateIcon from '../common/icons/CreateIcon';
import { InputField } from '../common/InputField';

const SignUpForm = () => {
  const userField = useInputField({
    name: 'username',
    placeholder: 'Username',
  });
  const passwordField = useInputField({
    name: 'password',
    placeholder: 'Password',
    type: 'password',
  });
  const emailField = useInputField({
    name: 'email',
    placeholder: 'E-mail**',
    type: 'email',
  });
  return (
    <div className="pt-3 pb-5 px-15 flex flex-col gap-3 items-center pointer-events-auto">
      <h1 className="text-3xl font-semibold text-left w-full pt-5 pb-3 relative">
        {'Create your account!*'}
      </h1>
      <div className="absolute w-full flex justify-end mr-6 -mt-1 text-regular text-gray-400">
        <span className="transition-all duration-150 w-6 h-6 rounded-full hover:bg-red-600/30 hover:text-white text-center cursor-pointer ">
          ✖
        </span>
      </div>
      <form className="flex flex-col gap-2 w-3xs items-center">
        <InputField {...userField.getProps()} className="h-8 w-3xs" />
        <InputField {...passwordField.getProps()} className="h-8 w-3xs" />
        <InputField {...emailField.getProps()} className="h-8 w-3xs" />
        <div className="italic text-xs text-gray-400 flex flex-col text-center gap-2">
          <div>
            {'* '}
            <span className="font-semibold">{'WIAG'}</span>
            {' accounts are for demo purposes only, but '}
            <span className="font-semibold">
              {'all passwords are encrypted'}
            </span>
          </div>
          <div>
            {'** '}
            <span className="font-semibold">{'E-mails are not verified'}</span>
            {', feel free to make one up!'}
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="relative mt-2 w-23 justify-center pl-5"
          >
            {'Create'}
            <span className="absolute w-full">
              <CreateIcon width={16} />
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
