import { JSX } from 'react';

interface SelectedLineProps {
  active?: boolean;
}

const SelectedLine = ({ active }: SelectedLineProps): JSX.Element | null => {
  if (!active) return null;
  return (
    <div
      className="absolute inset-y-0 -left-0.5 bg-current text-starblue"
      style={{ width: 3 }}
    />
  );
};
export default SelectedLine;
