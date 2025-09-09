import { JSX } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { usePersonQuery } from '../../queries/people-queries';
import { setTitle } from '../../utils/page-info-setter';
import EntryTitle from '../EntryTitle';
import PersonPagePoster from '../Posters/PersonPagePoster';
import { AuthorMedia } from '../../../../shared/types/roles';
import PersonRoleCredits from './PersonRoleCredits';
import NotFoundPage from '../Common/Status/NotFoundPage';
import LoadingPage from '../Common/Status/LoadingPage';
import { getAPIErrorMessage, isNotFoundError } from '../../utils/error-handler';
import IconUser from '../Common/Icons/IconUser';

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
