import { JSX } from 'react';
import { MediaType } from '../../../../../../shared/types/media';
import FilmIcon from './FilmIcon';
import ShowIcon from './ShowIcon';
import { MediaTypeProps } from '../../../../types/common-props-types';

const IconForMediaType = ({
  mediaType,
}: MediaTypeProps): JSX.Element | null => {
  switch (mediaType) {
    case MediaType.Film:
      return <FilmIcon />;
    case MediaType.Show:
      return <ShowIcon />;
    default:
      return null;
  }
};

export default IconForMediaType;
