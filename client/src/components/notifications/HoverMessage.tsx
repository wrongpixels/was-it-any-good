import { JSX } from 'react';

const DEF_CLASSNAME: string =
  'bg-cyan-400/75 shadow-sm text-white font-bold border-2 border-cyan-900 rounded-md text-2xl -translate-y-19 min-w-12 min-h-10 ring-1 ring-gray-400 text';

interface HoverMessageProps {
  message: string;
  classname?: string;
  extraClassname?: string;
}

const HoverMessage = ({
  message = '',
  classname = DEF_CLASSNAME,
  extraClassname = '',
}: HoverMessageProps): JSX.Element | null => {
  if (!message || message === '0') {
    return null;
  }

  return <div className={`${classname} ${extraClassname}`}>{message}</div>;
};

export default HoverMessage;
