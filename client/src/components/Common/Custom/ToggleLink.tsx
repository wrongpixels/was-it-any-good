import { Link, LinkProps } from 'react-router-dom';
import { ToggleLinkBaseProps } from '../../../types/common-props-types';

interface ToggleLinkProps extends Omit<LinkProps, 'to'>, ToggleLinkBaseProps {}
//a conditional link that becomes passthrough if not enabled or not valid link
const ToggleLink = ({
  to,
  newTab,
  enabled = true,
  children,
  ...rest
}: ToggleLinkProps) => {
  const renderLink = enabled && !!to;

  if (renderLink) {
    return (
      <Link
        to={to}
        className="no-underline text-inherit cursor-pointer"
        target={newTab ? '_blank' : ''}
        rel={newTab ? 'noopener noreferrer' : ''}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return <>{children}</>;
};

export default ToggleLink;
