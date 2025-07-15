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
}

export interface InputFieldProps
  extends InputLogicProps,
    InputPresentationProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface InputFieldHookValues {
  value: string;
  reset: VoidFunction;
  getProps: () => InputFieldProps;
}
