import { AuthorMedia } from '../../../../shared/types/roles';
import { MediaResponse } from '../../../../shared/types/models';
import ScrollableDiv from '../common/ScrollableDiv';
import Separator from '../common/Separator';
import PersonRolePoster from '../Poster/PersonRolePoster';
import PlaceholderPoster from '../Poster/PlaceholderPoster';
import { PLACEHOLDER_COUNT_PERSON } from '../../constants/placeholder-results-constants';

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
        <PlaceholderPoster placeholderCount={placeholderCount} />
      </ScrollableDiv>
    </div>
  );
};

export default PersonRoleCredits;
