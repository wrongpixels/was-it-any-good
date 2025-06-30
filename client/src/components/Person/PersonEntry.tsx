import { JSX } from 'react';
import { PathMatch, useMatch } from 'react-router-dom';
import { usePersonQuery } from '../../queries/people-queries';
import Poster from '../Poster/Poster';
import Title from '../Title';

const PersonEntry = (): JSX.Element | null => {
  const match: PathMatch | null = useMatch('/person/:id');
  const personId: string | undefined = match?.params.id;
  const { data: person, isError, isLoading, error } = usePersonQuery(personId);

  if (isLoading) {
    return <div>Loading person...</div>;
  }
  if (isError) {
    return <div>Error loading person: {`${error.message}`}</div>;
  }
  if (!person) {
    return <div>Person couldn't be found!</div>;
  }

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
