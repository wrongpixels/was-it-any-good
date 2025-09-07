import { JSX } from 'react';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import { toFirstUpperCase } from '../../../../../shared/helpers/format-helper';

interface DropdownProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label?: string;
  options?: string[];
  capitalizeOptions?: boolean;
}
const defClassName: string =
  'rounded-md border border-gray-400/50 px-3 py-2 text-sm cursor-pointer px-1 hover:ring hover:ring-amber-200 focus:outline-none focus:ring focus:ring-sky-400 focus:ring-offset-0 active:outline-none active:ring active:ring-sky-300 rounded shadow text-gray-600 font-semibold bg-gray-200';
const Dropdown = ({
  options,
  capitalizeOptions = true,
  className,
  label,
  children,
  ...props
}: DropdownProps): JSX.Element => {
  return (
    <div className="flex flex-row gap-2 items-center ">
      {label && <span className="">{label}</span>}
      <select {...props} className={mergeClassnames(defClassName, className)}>
        {options &&
          options.map((o: string, i: number) => (
            <option
              key={`${i}-${o}`}
              value={o}
              className="text-gray-700 bg-white shadow"
            >
              {!capitalizeOptions ? o : toFirstUpperCase(o)}
            </option>
          ))}
      </select>
      {children}
    </div>
  );
};

export default Dropdown;
