import { JSX } from 'react';
import { Link, PathMatch, useMatch } from 'react-router-dom';
import { usePersonQuery } from '../../queries/people-queries';
import BasicPoster from '../Poster/BasicPoster';
import { setTitle } from '../../utils/page-info-setter';
import EntryTitle from '../EntryTitle';
import { AuthorMedia } from '../../../../shared/types/roles';
import ScrollableDiv from '../common/ScrollableDiv';
import { IndexMediaData } from '../../../../shared/types/models';
import imageLinker from '../../../../shared/util/image-linker';
import { styles } from '../../constants/tailwind-styles';
import LazyImage from '../common/LazyImage';
import PosterRating from '../Poster/PosterRating';
import { useOverlay } from '../../context/OverlayProvider';
import {
  DEF_MINI_STAR_WIDTH,
  NO_RATINGS,
} from '../../constants/ratings-constants';
import DisplayRating from '../Rating/DisplayRating';
import IndexMediaRatingStars from '../IndexMedia/IndexMediaRatingStars';
import {
  mediaTypeToDisplayName,
  urlFromIndexMedia,
} from '../../utils/url-helper';
import Separator from '../common/Separator';

const PersonPage = (): JSX.Element | null => {
  const match: PathMatch | null = useMatch('/person/:id');
  const personId: string | undefined = match?.params.id;
  const { data: person, isError, isLoading, error } = usePersonQuery(personId);
  const { openAsOverlay } = useOverlay();

  if (isLoading) {
    setTitle('Loading...');
    return <div>Loading person...</div>;
  }
  if (isError) {
    setTitle('Error loading Person');
    return <div>Error loading person: {`${error.message}`}</div>;
  }
  if (!person) {
    setTitle('Person not found');
    return <div>Person couldn't be found!</div>;
  }
  console.log(person.sortedRoles);
  setTitle(person.name);
  return (
    <div>
      <EntryTitle title={person.name} />
      <div className="flex flex-row">
        <span className="w-40">
          <BasicPoster
            title={person.name}
            src={person.image}
            alt={person.name}
            extraInfo={person.sortedRoles?.mainRoles.join(', ')}
          />
        </span>
        <span className="pr-10 border-r-1 border-gray-200" />
        <div className="flex flex-col w-fit gap-2 pl-4 -mt-2">
          {person.sortedRoles?.mediaByRole.map(
            (media: AuthorMedia, index: number) => (
              <div key={media.authorType} className="flex flex-row">
                <span className="flex flex-col w-full">
                  {index > 0 && <Separator className="w-full pb-2" />}
                  <span className="text-left font-semibold text-lg pb-1">
                    {`${media.authorType}:`}
                  </span>
                  <ScrollableDiv className="ml-4">
                    {media.indexMedia.map((im: IndexMediaData) => (
                      <Link
                        to={urlFromIndexMedia(im)}
                        title={`${im.name} (${mediaTypeToDisplayName(im.mediaType)})`}
                      >
                        <div className={`w-35 ${styles.poster.animated()}`}>
                          <span className="text-sm text-gray-500 text-center -translate-y-1 line-clamp-2">
                            {im.name}
                          </span>
                          <LazyImage
                            src={imageLinker.getPosterImage(im.image)}
                            alt={im.name}
                            className={`rounded shadow ring-1 ring-gray-325`}
                          />
                          <IndexMediaRatingStars value={im.rating} />
                        </div>
                      </Link>
                    ))}
                  </ScrollableDiv>
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
