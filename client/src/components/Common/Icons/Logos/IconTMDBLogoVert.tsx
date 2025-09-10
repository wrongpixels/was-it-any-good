import { JSX } from 'react';
import { OptIconProps } from '../../../../types/common-props-types';
import IMG from '../../Custom/IMG';

//this didn't work as a svg for some reason, so a specific img component had to
//be created

const IconTMDBLogoVert = ({
  width = 30,
  newTab,
  url,
  className,
  title,
}: OptIconProps): JSX.Element => (
  <IMG
    title={title}
    newTab={newTab}
    className={className}
    src={'/logos/logo-tmdb-vert.png'}
    url={url}
    width={width}
  />
);

export default IconTMDBLogoVert;
