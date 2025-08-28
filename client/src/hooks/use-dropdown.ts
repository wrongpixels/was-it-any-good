import { ChangeEvent, useState } from 'react';

interface DropdownHookConfig<T> {
  name?: string;
  defaultValue?: T;
  disabled?: boolean;
  onChanged?: (newValue: string) => void;
}

//a hook to setup controlled dropdown hooks.
//we set a "fake" defaultValue for clarity but we then
//extract it from the props to avoid error messages (both value and defaultValue)
const useDropdown = <T>({
  defaultValue,
  onChanged,
  ...props
}: DropdownHookConfig<T>) => {
  const [value, setValue] = useState<T | string>(defaultValue || '');
  const onChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setValue(e.target.value);
    onChanged?.(e.target.value);
  };

  const clean = () => setValue('');
  const reset = () => setValue(defaultValue || '');

  const getProps = () => ({ ...props, value, onChange });

  return { value, setValue, reset, clean, getProps };
};

export default useDropdown;
