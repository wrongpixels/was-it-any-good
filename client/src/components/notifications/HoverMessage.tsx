import { JSX } from 'react';

const DEF_CLASSNAME: string =
  'bg-hoverblue/80 shadow-sm text-white font-bold border-2 border-cyan-900 rounded-md text-2xl -translate-y-20 min-w-13 min-h-12 ring-1 px-2 ring-gray-500 text';

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
  if (message === 'Unvote') {
    extraClassname = 'font-semibold text-xl';
  }

  return (
    <div
      className={`flex items-center justify-center ${classname} ${extraClassname}`}
    >
      {message}
    </div>
  );
};

export default HoverMessage;
