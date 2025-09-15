import { JSX } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { usePersonQuery } from '../../queries/people-queries';
import { setTitle } from '../../utils/page-info-setter';
import EntryTitle from '../EntryTitle';
import PersonPagePoster from '../Posters/PersonPagePoster';
import { AuthorMedia } from '../../../../shared/types/roles';
import PersonRoleCredits from './PersonRoleCredits';
import LoadingPage from '../Common/Status/LoadingPage';
import { isNotFoundError } from '../../utils/error-handler';
import IconUser from '../Common/Icons/IconUser';
import WrongIdFormatPage from '../Common/Status/WrongIdFormatPage';
import MediaMissing from '../Media/MediaMissing';
import ErrorPage from '../Common/Status/ErrorPage';

const PersonPage = (): JSX.Element | null => {
  const match: PathMatch | null = useMatch('/person/:id');
  const personId: string | undefined = match?.params.id;
  const {
    data: person,
    isError,
    isLoading,
    isFetching,
    error,
  } = usePersonQuery(personId);

  if (personId && isNaN(Number(personId))) {
    return <WrongIdFormatPage />;
  }

  if (isFetching || isLoading) {
    return <LoadingPage text="person" />;
  }

  if (!person || isError) {
    if (isNotFoundError(error)) {
      return <MediaMissing mediaId={personId} contentType={'Person'} />;
    }
    return <ErrorPage context={'loading Person'} error={error?.message} />;
  }

  setTitle(person.name);
  return (
    <div className="flex flex-col flex-1 justify-center">
      <EntryTitle
        title={person.name}
        icon={<IconUser height={30} className="text-starblue" />}
      />
      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-auto flex flex-row justify-center">
          <div className="w-50 md:w-40 mt-3 md:mt-7 md:mb-0 mb-7 md:flex-shrink-0 align-middle">
            <PersonPagePoster
              title={person.name}
              src={person.image}
              alt={person.name}
              extraInfo={person.sortedRoles?.mainRoles.join(', ')}
            />
          </div>
        </div>
        <div className="flex-1 border-l border-gray-200 md:ml-10 pl-4 overflow-auto">
          <div className="flex flex-col gap-2 -mt-2">
            {person.sortedRoles?.mediaByRole.map(
              (media: AuthorMedia, index: number) => (
                <PersonRoleCredits
                  key={media.authorType}
                  authorMedia={media}
                  isFirst={index === 0}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
