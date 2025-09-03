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
}

export interface InputFieldHookConfig extends InputLogicProps {
  label?: string;
  initialValue?: string;
  rules?: InputFieldRules;
}

export interface InputFieldProps
  extends InputLogicProps,
    InputPresentationProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
export interface InputFieldRules {
  minLength?: number;
  maxLength?: number;
  includeNumber?: boolean;
}

export interface InputFieldValidation {
  isError: boolean;
  isValidated: boolean;
  errorMessage: string;
}
export interface InputFieldHookValues {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  reset: VoidFunction;
  isError: boolean;
  isValidated: boolean;
  errorMessage: string;
  getProps: () => InputFieldProps;
}
