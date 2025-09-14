import { ChangeEvent, useState } from 'react';
import { DropdownOption, getDropdownValue } from '../../../shared/types/common';

interface DropdownHookConfig {
  name?: string;
  defaultValue?: DropdownOption;
  disabled?: boolean;
  onChanged?: (newValue: string) => void;
}

//a hook to setup controlled dropdown hooks.
//we set a "fake" defaultValue for clarity but we then
//extract it from the props to avoid error messages (both value and defaultValue)
const useDropdown = ({
  defaultValue,
  onChanged,
  ...props
}: DropdownHookConfig) => {
  const [value, setValue] = useState<DropdownOption>(
    defaultValue ? getDropdownValue(defaultValue) : ''
  );
  const onChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setValue(e.target.value);
    onChanged?.(e.target.value);
  };

  const clean = () => setValue('');
  const reset = () => setValue(defaultValue || '');
  console.log(value);
  const getProps = () => ({ ...props, value, onChange });

  return { value, setValue, reset, clean, getProps };
};

export default useDropdown;
