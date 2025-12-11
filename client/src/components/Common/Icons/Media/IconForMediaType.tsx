import { JSX } from 'react';
import { MediaType } from '../../../../../../shared/types/media';
import IconFilm from './IconFilm';
import IconShow from './IconShow';
import {
  MediaTypeProps,
  OptIconProps,
} from '../../../../types/common-props-types';

interface IconMediaProps extends MediaTypeProps, OptIconProps {}

const IconForMediaType = ({
  mediaType,
  ...props
}: IconMediaProps): JSX.Element | null => {
  switch (mediaType) {
    case MediaType.Film:
      return <IconFilm title="Film" {...props} />;
    case MediaType.Show:
    case MediaType.Season:
      return <IconShow title="TV Show" {...props} />;
    default:
      return null;
  }
};

export const SmallIconForMediaType = (props: IconMediaProps) => (
  <IconForMediaType
    width={props.mediaType === MediaType.Film ? 14 : 15}
    {...props}
  />
);

export default IconForMediaType;
