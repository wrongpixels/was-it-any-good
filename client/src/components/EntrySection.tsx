import { JSX } from 'react';

interface EntryProps {
  title: string;
  content?: string;
}

const EntrySection = ({ title, content }: EntryProps): JSX.Element | null => {
  if (!title || !content) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      <h2 className="block text-xl font-bold">{title}</h2>
      <p className="text-gray-500 text-sm leading-relaxed text-justify">
        {content}
      </p>
    </div>
  );
};

export default EntrySection;
