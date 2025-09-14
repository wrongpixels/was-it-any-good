import { JSX } from 'react';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import { toFirstUpperCase } from '../../../../../shared/helpers/format-helper';
import { DropdownOption } from '../../../../../shared/types/common';

interface DropdownProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label?: string;
  //we accept options as simple strings or pairs with display name
  options?: DropdownOption[];
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
    <div className="flex flex-row gap-2 items-center text-sm sm:text-base">
      {label && <span className="hidden md:block">{label}</span>}
      <select {...props} className={mergeClassnames(defClassName, className)}>
        {options &&
          options.map((o: DropdownOption, i: number) => {
            const display: string = Array.isArray(o) ? o[1] : o;
            const value: string = Array.isArray(o) ? o[0] : o;
            return (
              <option
                key={`${i}-${value}`}
                value={o}
                className="text-gray-700 bg-white shadow"
              >
                {!capitalizeOptions ? display : toFirstUpperCase(display)}
              </option>
            );
          })}
      </select>
      {children}
    </div>
  );
};

export default Dropdown;
