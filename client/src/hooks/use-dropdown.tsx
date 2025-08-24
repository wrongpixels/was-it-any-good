import { ChangeEvent, useState } from 'react';

const useDropdown = (
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
) => {
  const [value, setValue] = useState<string | number | readonly string[]>(
    props.defaultValue || ''
  );

  const onChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setValue(e.target.value);

  const clean = () => setValue('');
  const reset = () => setValue(props.defaultValue || '');

  const getProps = () => ({ ...props, value, onChange });

  return { value, setValue, reset, clean, getProps };
};

export default useDropdown;
