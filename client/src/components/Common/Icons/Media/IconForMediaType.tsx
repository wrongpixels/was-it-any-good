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
      return <IconShow title="TV Show" {...props} />;
    default:
      return null;
  }
};

export default IconForMediaType;
