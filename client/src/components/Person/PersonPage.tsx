import { JSX } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
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
      <div className="pt-3 flex flex-row">
        <span className="inline-block w-40">
          <BasicPoster
            title={person.name}
            src={person.image}
            alt={person.name}
            extraInfo={person.sortedRoles?.mainRoles.join(', ')}
          />
        </span>
        <div className="flex flex-col w-fit">
          {person.sortedRoles?.mediaByRole.map((media: AuthorMedia) => (
            <div key={media.authorType}>
              <span>{`As ${media.authorType}`}</span>
              <ScrollableDiv>
                {media.indexMedia.map((i: IndexMediaData) => (
                  <div className={`w-35 ${styles.poster.regular()}`}>
                    <LazyImage
                      src={imageLinker.getPosterImage(i.image)}
                      alt={i.name}
                      title={i.name}
                      className={`rounded shadow`}
                      onClick={() =>
                        openAsOverlay(imageLinker.getFullSizeImage(i.image))
                      }
                    />
                    <IndexMediaRatingStars value={i.rating} />
                  </div>
                ))}
              </ScrollableDiv>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
