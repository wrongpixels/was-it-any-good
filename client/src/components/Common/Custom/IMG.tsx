import { ToggleLinkBaseProps } from '../../../types/common-props-types';
import ToggleLink from './ToggleLink';

interface CustomIMGProps
  extends React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    Omit<ToggleLinkBaseProps, 'to'> {
  url?: string;
}

const IMG = ({ url, newTab, enabled, children, ...rest }: CustomIMGProps) => {
  return (
    <ToggleLink to={url} newTab={newTab} enabled={enabled}>
      <img role="img" {...rest} />
    </ToggleLink>
  );
};

export default IMG;
