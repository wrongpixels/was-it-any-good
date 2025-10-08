import { JSX, memo } from 'react';
import { OptStringProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import { CLEAN_WIKIPEDIA_DESCRIPTION } from '../../constants/format-constants';
import { split } from 'sentence-splitter';
import { TxtParentNodeWithSentenceNodeContent } from 'sentence-splitter';

const baseClassName: string = 'text-sm text-gray-400 italic';

//we remove the Wikipedia sentence from the description and only show 2 sentences max.
export const cleanDescription = (text: string): string => {
  const nodes: TxtParentNodeWithSentenceNodeContent[] = split(text);

  const sentences: string[] = nodes
    .filter((node) => node.type === 'Sentence')
    .map((node) => node.raw.trim());

  return sentences
    .filter((s) => !s.includes(CLEAN_WIKIPEDIA_DESCRIPTION))
    .slice(0, 2)
    .join(' ')
    .trim();
};
const PersonDescription = ({
  text,
  className,
}: OptStringProps): JSX.Element | null => {
  if (!text) {
    return null;
  }
  return (
    <div className={mergeClassnames(baseClassName, className)}>
      {cleanDescription(text)}
    </div>
  );
};

export default memo(PersonDescription);
