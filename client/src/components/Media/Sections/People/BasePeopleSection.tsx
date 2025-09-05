import { JSX } from 'react';
import { MergedCredits, CreditResponse } from '../../../../../../shared/types/models';
import MediaPeopleEntry from './MediaPeopleEntry';

interface BasePeopleSectionProps {
  title: string;
  content?: string;
  people: MergedCredits[] | CreditResponse[];
}

const BasePeopleSection = ({
  title,
  content,
  people,
}: BasePeopleSectionProps): JSX.Element | null => {
  if (!title || !people || people.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      <h2 className="block text-xl font-bold">{title}</h2>
      {content && (
        <p className="text-gray-700 text-sm leading-relaxed text-justify">
          {content}
        </p>
      )}
      <MediaPeopleEntry people={people} />
    </div>
  );
};

export default BasePeopleSection;
