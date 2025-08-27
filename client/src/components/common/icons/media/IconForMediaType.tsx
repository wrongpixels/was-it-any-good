import { JSX } from 'react';
import { MediaType } from '../../../../../../shared/types/media';
import FilmIcon from './IconFilm';
import ShowIcon from './IconShow';
import { MediaTypeProps } from '../../../../types/common-props-types';

const IconForMediaType = ({
  mediaType,
  ...props
}: MediaTypeProps): JSX.Element | null => {
  switch (mediaType) {
    case MediaType.Film:
      return <FilmIcon className={props.className} title="Film" />;
    case MediaType.Show:
      return <ShowIcon className={props.className} title="TV Show" />;
    default:
      return null;
  }
};

export default IconForMediaType;
