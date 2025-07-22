import { JSX, PropsWithChildren } from 'react';
import { MediaResponse } from '../../../../shared/types/models';
import EntryTitle from '../EntryTitle';

interface MediaTitleProps extends PropsWithChildren {
  media: MediaResponse;
}

const MediaTitle = ({
  media: { name, releaseDate, country, originalName, mediaType },
  children,
}: MediaTitleProps): JSX.Element => {
  return (
    <EntryTitle
      title={name}
      subtitle={originalName}
      country={country}
      date={releaseDate}
      mediaType={mediaType}
      children={children}
    />
  );
};

export default MediaTitle;
