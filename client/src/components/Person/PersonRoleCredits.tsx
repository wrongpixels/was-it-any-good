import { AuthorMedia } from '../../../../shared/types/roles';
import { MediaResponse } from '../../../../shared/types/models';
import ScrollableDiv from '../Common/Custom/ScrollableDiv';
import PersonRolePoster from '../Posters/PersonRolePoster';
import PlaceholderPoster from '../Posters/PlaceholderPoster';
import { PLACEHOLDER_COUNT_PERSON } from '../../constants/placeholder-results-constants';
import Separator from '../Common/Separator';

interface PersonRoleCreditsProps {
  authorMedia: AuthorMedia;
  isFirst: boolean;
}

const PersonRoleCredits = ({
  authorMedia,
  isFirst,
}: PersonRoleCreditsProps) => {
  const placeholderCount: number =
    PLACEHOLDER_COUNT_PERSON - authorMedia.media.length;
  return (
    <div className="h-full">
      {!isFirst && <Separator className="w-full pb-2" />}
      <h2 className="text-left font-bold text-lg pb-1">
        {`${authorMedia.authorType} (${authorMedia.media.length})`}
      </h2>

      <ScrollableDiv className="ml-4">
        {authorMedia.media.map((m: MediaResponse) => (
          <PersonRolePoster mediaResponse={m} key={m.id} />
        ))}
        <PlaceholderPoster
          placeholderCount={placeholderCount}
          className="hidden sm:block"
        />
        <PlaceholderPoster placeholderCount={1} className="block sm:hidden" />
      </ScrollableDiv>
    </div>
  );
};

export default PersonRoleCredits;
