import { AuthorMedia, AuthorType } from '../../../../shared/types/roles';
import {
  MediaResponse,
  MediaRoleResponse,
} from '../../../../shared/types/models';
import ScrollableDiv from '../Common/Custom/ScrollableDiv';
import PersonRolePoster from '../Posters/PersonRolePoster';
import PlaceholderPoster from '../Posters/PlaceholderPoster';
import { PLACEHOLDER_COUNT_PERSON } from '../../constants/placeholder-results-constants';
import Separator from '../Common/Separator';
import { getMediaFromRole } from '../../../../shared/helpers/media-helper';
import { formatCharacterNames } from '../../utils/person-details-helper';

interface PersonRoleCreditsProps {
  authorMedia: AuthorMedia;
  isFirst: boolean;
}

const PersonRoleCredits = ({
  authorMedia,
  isFirst,
}: PersonRoleCreditsProps) => {
  const placeholderCount: number =
    PLACEHOLDER_COUNT_PERSON - authorMedia.role.length;
  return (
    <div className="h-full">
      {!isFirst && <Separator className="w-full pb-2" />}
      <h2 className="text-left font-bold text-lg pb-1">
        {`${authorMedia.authorType} (${authorMedia.role.length})`}
      </h2>

      <ScrollableDiv className="ml-4">
        {authorMedia.role.map((r: MediaRoleResponse) => {
          const media: MediaResponse | undefined = getMediaFromRole(r);
          return (
            media && (
              <PersonRolePoster
                mediaResponse={media}
                characterNames={
                  [AuthorType.Actor, AuthorType.VoiceActor].includes(r.role)
                    ? formatCharacterNames(r.characterName)
                    : undefined
                }
                key={r.id}
              />
            )
          );
        })}
        <PlaceholderPoster
          placeholderCount={placeholderCount}
          className="hidden sm:block h-80"
        />
        <PlaceholderPoster
          placeholderCount={1}
          className="block sm:hidden h-80"
        />
      </ScrollableDiv>
    </div>
  );
};

export default PersonRoleCredits;
