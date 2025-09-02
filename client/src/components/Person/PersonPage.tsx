import { JSX } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { usePersonQuery } from '../../queries/people-queries';
import { setTitle } from '../../utils/page-info-setter';
import EntryTitle from '../EntryTitle';
import PersonPagePoster from '../Poster/PersonPagePoster';
import { AuthorMedia } from '../../../../shared/types/roles';
import PersonRoleCredits from './PersonRoleCredits';
import IconUser from '../common/icons/IconUser';
import NotFoundPage from '../common/status/NotFoundPage';
import LoadingPage from '../common/status/LoadingPage';
import { getAPIErrorMessage, isNotFoundError } from '../../utils/error-handler';

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

  if (isFetching || isLoading) {
    return <LoadingPage text="person" />;
  }

  if (!person || isError) {
    console.log(error);
    if (isNotFoundError(error)) {
      setTitle('Person not found');
      return <NotFoundPage text="person" />;
    }
    setTitle('Error loading Person');
    return <div>Error loading person: {`${getAPIErrorMessage(error)}`}</div>;
  }

  setTitle(person.name);
  return (
    <div className="flex flex-col flex-1 justify-center">
      <EntryTitle
        title={person.name}
        icon={<IconUser height={30} className="text-starblue" />}
      />
      <div className="flex flex-row flex-1">
        <div className="w-40 mt-7 flex-shrink-0">
          <PersonPagePoster
            title={person.name}
            src={person.image}
            alt={person.name}
            extraInfo={person.sortedRoles?.mainRoles.join(', ')}
          />
        </div>

        <div className="flex-1 border-l border-gray-200 ml-10 pl-4 overflow-auto">
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
