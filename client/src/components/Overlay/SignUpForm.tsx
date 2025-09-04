import { PropsWithChildren, useRef } from 'react';
import { useInputField } from '../../hooks/use-inputfield';
import Button from '../common/Button';
import IconCreate from '../common/icons/IconCreate';
import { InputField } from '../common/InputField';
import Separator from '../common/Separator';
import { verifyCreateUserData } from '../../utils/create-user-verifier';
import { AnimatedDiv } from '../common/AnimatedDiv';
import { useAnimEngine } from '../../context/AnimationProvider';
import { useNotificationContext } from '../../context/NotificationProvider';
import { useAuth } from '../../hooks/use-auth';
import { useCreateUserMutation } from '../../mutations/user-mutations';
import { VerifyCreateUser } from '../../../../shared/types/models';
import IconLoadingSpinner from '../common/icons/IconLoadingSpinner';
import DisabledDiv from '../common/DisabledDiv';
import { getAPIErrorMessage } from '../../utils/error-handler';
import { BLACKLISTED_USERNAMES } from '../../constants/user-constants';

interface SignUpFormProps {
  clean: VoidFunction;
}

const SignUpForm = ({ clean }: SignUpFormProps) => {
  const { playAnim } = useAnimEngine();
  const { login } = useAuth();
  const { setNotification, setError } = useNotificationContext();
  const createUserMutation = useCreateUserMutation();
  const anchorRef = useRef<HTMLDivElement | null>(null);

  //custom input fields with validation
  const userField = useInputField({
    name: 'username',
    placeholder: 'Username',
    rules: {
      minLength: 4,
      maxLength: 20,
      blackList: BLACKLISTED_USERNAMES,
    },
  });
  const passwordField = useInputField({
    name: 'password',
    placeholder: 'Password',
    type: 'password',
    rules: {
      minLength: 8,
      maxLength: 72,
      includeNumber: true,
    },
  });
  const emailField = useInputField({
    name: 'email',
    placeholder: 'E-mail**',
    type: 'email',
    rules: {
      maxLength: 72,
      isEmail: true,
    },
  });

  const canSubmit: boolean =
    userField.isSuccess && passwordField.isSuccess && emailField.isSuccess;

  const submitCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData: VerifyCreateUser = {
      username: userField.value,
      password: passwordField.value,
      email: emailField.value,
    };
    const { isError, errorMessage } = verifyCreateUserData(userData);
    if (isError) {
      setNotification({ message: errorMessage, anchorRef });
      playAnim({
        animKey: 'submit-user-button',
        animationClass: 'animate-shake',
      });
      return;
    }
    createUserMutation.mutate(userData, {
      onSuccess: async () => {
        login(
          { username: userData.username, password: userData.password },
          {
            onSuccess: () =>
              setNotification({
                message: `Welcome to WIAG, ${userData.username}!`,
              }),
          }
        );
        clean();
      },
      onError: (error: Error) => {
        const message: string = getAPIErrorMessage(error);
        if (message.toLowerCase().includes('username')) {
          userField.setIsError(true);
        }
        setError({ message, anchorRef });
        playAnim({
          animKey: 'submit-user-button',
          animationClass: 'animate-shake',
        });
      },
    });
  };
  return (
    <DisabledDiv
      ref={anchorRef}
      disabled={createUserMutation.isPending}
      className="pt-3 pb-5 px-15 flex flex-col gap-3 items-center pointer-events-auto"
    >
      <div className="text-3xl font-semibold text-left flex flex-row pt-5 relative">
        <h1>{'Create your account!'}</h1>
        <span className="text-gray-400">*</span>
      </div>
      <Separator margin={false} className="pb-2 text-gray-500" />
      <div className="absolute right-2 top-2 text-gray-400">
        <button
          type="button"
          onClick={() => clean()}
          aria-label="Close"
          className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-150 hover:bg-red-600/30 hover:text-white"
        >
          ✖
        </button>
      </div>
      <form
        className="flex flex-col gap-2 w-3xs items-center"
        onSubmit={submitCreateUser}
      >
        <InputField {...userField.getProps()} className={'h-8 w-3xs'} />

        {userField.isError && <SubSection>{userField.errorMessage}</SubSection>}
        <InputField {...passwordField.getProps()} className={'h-8 w-3xs'} />
        {passwordField.isError && (
          <SubSection>{passwordField.errorMessage}</SubSection>
        )}
        <InputField {...emailField.getProps()} className="h-8 w-3xs" />
        {emailField.isError && (
          <SubSection>{emailField.errorMessage}</SubSection>
        )}
        <SubSection>
          <div>
            {'* '}
            <span className="font-semibold">{'WIAG'}</span>
            {' accounts are for demo purposes and '}
            <span className="font-semibold">
              {'all passwords are encrypted'}
            </span>
          </div>
          <div>
            {'** '}
            <span className="font-semibold">{'E-mails are not verified'}</span>
            {', just make one up!'}
          </div>
        </SubSection>
        <AnimatedDiv
          animKey="submit-user-button"
          className="flex justify-center"
        >
          <Button
            disabled={!canSubmit || createUserMutation.isPending}
            type="submit"
            className="relative mt-2 w-23 justify-center pl-5"
          >
            {'Create'}
            <span className="absolute w-full ">
              {createUserMutation.isPending ? (
                <IconLoadingSpinner className="text-white" />
              ) : (
                <IconCreate width={16} />
              )}
            </span>
          </Button>
        </AnimatedDiv>
      </form>
    </DisabledDiv>
  );
};

const SubSection = ({ children }: PropsWithChildren) => (
  <div className="italic text-xs text-gray-400 flex flex-col text-left gap-2 w-full">
    {children}
  </div>
);

export default SignUpForm;
