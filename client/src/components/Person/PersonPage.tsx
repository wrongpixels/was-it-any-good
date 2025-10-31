import { JSX, memo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePersonQuery } from '../../queries/people-queries';
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
import PersonDetails from './PersonDetails';
import PersonDescription from './PersonDescription';
import {
  buildPersonDetails,
  PersonDetailsValues,
} from '../../utils/person-details-builder';
import { routerPaths } from '../../utils/url-helper';
import { setSEO } from '../../utils/set-seo';
import { buildPersonSEO } from '../../utils/page-seo-helpers';

//to force a refresh when the slug changes
const PersonPage = () => {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const key = `${id}${slug ? `-${slug}` : ''}`;
  return <KeyedPersonPage key={key} />;
};

const KeyedPersonPage = (): JSX.Element | null => {
  const { id: personId, slug } = useParams<{ id: string; slug: string }>();
  const {
    data: person,
    isError,
    isLoading,
    error,
  } = usePersonQuery(personId, slug);
  const navigate = useNavigate();
  if (!personId || isNaN(Number(personId))) {
    return <WrongIdFormatPage />;
  }

  useEffect(() => {
    if (person?.expectedSlug) {
      //if we used a wrong slug, we redirect to the actual one.
      const slugUrl: string = routerPaths.people.byId(
        personId,
        person.expectedSlug
      );
      console.log('Redirecting to', slugUrl);
      navigate(slugUrl, { replace: true });
    }
  }, [slug, person?.expectedSlug]);

  if (isLoading || person?.expectedSlug) {
    return <LoadingPage text="person" />;
  }

  if (!person || isError) {
    if (isNotFoundError(error)) {
      return <MediaMissing mediaId={personId} contentType={'Person'} />;
    }
    return <ErrorPage context={'loading Person'} error={error?.message} />;
  }
  const personDetailsValues: PersonDetailsValues = buildPersonDetails(person);
  //setTitle(person.name);
  setSEO(buildPersonSEO(person, personDetailsValues));

  return (
    <div className="flex flex-col flex-1 justify-center">
      <EntryTitle
        title={person.name}
        icon={<IconUser height={30} className="text-starblue" />}
      />
      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-55 flex flex-col items-center">
          <div className="w-50 md:w-50 mt-3 md:mt-0 md:mb-0 mb-7 md:flex-shrink-0 align-middle">
            <PersonPagePoster
              title={person.name}
              src={person.image}
              alt={person.name}
              extraInfo={personDetailsValues.mainRoles}
            />
          </div>
          {person.addedDetails && (
            <div className="-mt-2 md:mt-3 w-full">
              <PersonDetails personValues={personDetailsValues} />
            </div>
          )}
        </div>
        <div className="flex-1 md:border-l md:border-gray-200 md:ml-10 md:pl-4 overflow-auto">
          <div className="flex flex-col gap-2 md:-mt-2">
            <PersonDescription
              text={personDetailsValues.description}
              className="mt-1"
            />
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

export default memo(PersonPage);
