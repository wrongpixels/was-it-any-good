import { CreditResponse } from '../../../shared/types/models';
import { UNKNOWN_CAST } from '../../../shared/defaults/media-defaults';
import BasePeopleSection from './BasePeopleSection';
import { JSX } from 'react';

interface CastEntryProps {
  title: string;
  content?: string;
  cast?: CreditResponse[];
}

const CastEntrySection = ({
  title,
  content,
  cast,
}: CastEntryProps): JSX.Element | null => {
  const validCast = cast && cast.length > 0 ? cast : UNKNOWN_CAST;
  return (
    <BasePeopleSection title={title} content={content} people={validCast} />
  );
};

export default CastEntrySection;
