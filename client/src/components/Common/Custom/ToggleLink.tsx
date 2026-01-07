import { Link, LinkProps } from 'react-router-dom';
import { ToggleLinkBaseProps } from '../../../types/common-props-types';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';

interface ToggleLinkProps extends Omit<LinkProps, 'to'>, ToggleLinkBaseProps {}
//a conditional link that becomes passthrough if not enabled or not valid link
const ToggleLink = ({
  to,
  newTab,
  enabled = true,
  children,
  className,
  ...rest
}: ToggleLinkProps) => {
  const renderLink = enabled && !!to;

  if (renderLink) {
    return (
      <Link
        to={to}
        className={mergeClassnames(
          'no-underline text-inherit cursor-pointer',
          className
        )}
        target={newTab ? '_blank' : ''}
        rel={newTab ? 'noopener noreferrer' : ''}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
};

export default ToggleLink;
