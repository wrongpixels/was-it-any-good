import { JSX } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { usePersonQuery } from '../../queries/people-queries';
import Poster from '../Poster/Poster';
import Title from '../Title';
import { setTitle } from '../../utils/page-info-setter';

const PersonEntry = (): JSX.Element | null => {
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
    <div>
      <Title
        title={person.name}
        date={person.birthDate}
        country={person.country}
      />
      <div className="pt-3">
        <Poster title={person.name} src={person.image} alt={person.name} />
        {person.roles?.length}
      </div>
    </div>
  );
};

export default PersonEntry;
