import { JSX } from 'react';

interface SeparatorProps {
  margin?: boolean;
}

const Separator = ({ margin = true }: SeparatorProps): JSX.Element => (
  <div className={`border-t border-gray-200 ${margin ? 'mt-3' : ''}`} />
);

export default Separator;
