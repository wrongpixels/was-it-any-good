import { JSX } from 'react';

const DEF_CLASSNAME: string =
  'bg-hoverblue/80 shadow-sm text-white font-bold border-2 border-cyan-900 rounded-md text-2xl -translate-y-19 min-w-12 min-h-10 ring-1 px-2 ring-gray-500 text';

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
