import { joinUrl, slugifyUrl } from '../../../shared/helpers/format-helper';
import Country from '../../../shared/types/countries';
import { PersonResponse } from '../../../shared/types/models';
import imageLinker from '../../../shared/util/image-linker';
import { SEOData } from '../hooks/use-seo';
import { DEF_URL } from './page-info-setter';
import { PersonDetailsValues } from './person-details-builder';
import { routerPaths } from './url-helper';

export const buildPersonSEO = (
  person: PersonResponse,
  personDetails: PersonDetailsValues
): SEOData => {
  const url: string = joinUrl(
    DEF_URL,
    slugifyUrl(routerPaths.people.byId(person.id), person.name)
  );
  const imageUrl: string = imageLinker.getAvatarImage(person.image);
  return {
    title: person.name,
    description: personDetails.description,
    url,
    imageUrl,
    type: 'person',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: person.name,
      nationality:
        person.country[0] !== 'UNKNOWN'
          ? {
              '@type': 'Country',
              name: Country[person.country[0]],
              code: person.country[0],
            }
          : undefined,
      url,
      image: imageUrl,
      jobTitle: personDetails.mainRolesWithAnd,
      birthDate: person.birthDate,
    },
  };
};
