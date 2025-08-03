import { JSX } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { usePersonQuery } from '../../queries/people-queries';
import BasicPoster from '../Poster/BasicPoster';
import { setTitle } from '../../utils/page-info-setter';
import EntryTitle from '../EntryTitle';
import imageLinker from '../../../../shared/util/image-linker';

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
  console.log(person.sortedRoles);
  setTitle(person.name);
  return (
    <div>
      <EntryTitle title={person.name} />
      <div className="pt-3 w-43">
        <BasicPoster
          title={person.name}
          src={person.image}
          alt={person.name}
          extraInfo={person.sortedRoles?.mainRoles.join(', ')}
        />
      </div>
    </div>
  );
};

export default PersonPage;
