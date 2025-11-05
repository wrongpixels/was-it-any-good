import { JSX } from 'react';
import { OptIconProps } from '../../../../types/common-props-types';
import IMG from '../../Custom/IMG';

const IconWIAGLogoImage = ({
  width = 80,
  newTab,
  url,
  className,
  title,
}: OptIconProps): JSX.Element => (
  <IMG
    title={title}
    newTab={newTab}
    className={className}
    src={'/logos/logo-wiag-small.png'}
    url={url}
    width={width}
  />
);

export default IconWIAGLogoImage;
