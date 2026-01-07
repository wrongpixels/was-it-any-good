import { ChangeEvent } from 'react';

export interface InputPresentationProps {
  label?: string;
  labelClassName?: string;
  className?: string;
}

export interface InputLogicProps {
  name: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}

export interface InputFieldHookConfig extends InputLogicProps {
  label?: string;
  initialValue?: string;
  rules?: InputFieldRules;
  onChange?: () => void;
}

interface CommonInputProps {
  value: string;
  visualValidation?: boolean;
  maxLength?: number;
  minLength?: number;
  isSuccess?: boolean;
  isError?: boolean;
}

export interface TextAreaProps
  extends InputLogicProps,
    InputPresentationProps,
    CommonInputProps {
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface InputFieldProps
  extends InputLogicProps,
    InputPresentationProps,
    CommonInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
export interface InputFieldRules {
  minLength?: number;
  maxLength?: number;
  blackList?: string[];
  isEmail?: boolean;
  includeNumber?: boolean;
  visualValidation?: boolean;
}

export interface InputFieldValidation {
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
}
export interface InputFieldHookValues {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  reset: VoidFunction;
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
  setError: (message: string) => void;
  setSuccess: VoidFunction;
  getProps: () => InputFieldProps;
}
