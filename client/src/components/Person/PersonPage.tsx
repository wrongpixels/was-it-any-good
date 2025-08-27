import { JSX } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { usePersonQuery } from '../../queries/people-queries';
import { setTitle } from '../../utils/page-info-setter';
import EntryTitle from '../EntryTitle';
import PersonPagePoster from '../Poster/PersonPagePoster';
import { AuthorMedia } from '../../../../shared/types/roles';
import PersonRoleCredits from './PersonRoleCredits';
import IconUser from '../common/icons/IconUser';

const PersonPage = (): JSX.Element | null => {
  const match: PathMatch | null = useMatch('/person/:id');
  const personId: string | undefined = match?.params.id;
  const { data: person, isError, isLoading, error } = usePersonQuery(personId);

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
