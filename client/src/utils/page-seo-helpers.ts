import { joinUrl, slugifyUrl } from '../../../shared/helpers/format-helper';
import Country from '../../../shared/types/countries';
import { MediaType } from '../../../shared/types/media';
import {
  CreditResponse,
  FilmResponse,
  GenreResponse,
  MediaResponse,
  PersonResponse,
  SeasonResponse,
  ShowResponse,
} from '../../../shared/types/models';
import { AuthorType } from '../../../shared/types/roles';
import imageLinker from '../../../shared/util/image-linker';
import { SEOData } from './set-seo';
import { DEF_URL } from './page-info-setter';
import { PersonDetailsValues } from './person-details-builder';
import { isSpecialSeason } from './seasons-setter';
import {
  buildMediaLinkWithSlug,
  mediaTypeToDisplayName,
  routerPaths,
} from './url-helper';

const LIMIT_DIRECTORS: number = 3;
const LIMIT_CREATORS: number = 3;
const LIMIT_ACTORS: number = 7;

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
    description: personDetails.description.substring(0, 150),
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
const safeTruncate = (text: string, maxLength: number = 150): string => {
  if (!text || text.length <= maxLength)
    return text || 'No description available.';
  return text.substring(0, maxLength).trim() + '...';
};

const buildBaseMediaSEO = (media: MediaResponse): SEOData => {
  const url: string = joinUrl(DEF_URL, buildMediaLinkWithSlug(media));
  const imageUrl: string = imageLinker.getPosterImage(media.image);
  const description: string = safeTruncate(media.description, 150);
  const genre: string[] = media.genres?.map((g: GenreResponse) => g.name) || [];

  let aggregateRating: object | undefined;
  if ((media.rating > 0 || media.baseRating > 0) && media.voteCount > 0) {
    aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: media.rating || media.baseRating,
      bestRating: 10,
      ratingCount: media.voteCount,
      worstRating: 1,
    };
  }

  const director =
    (media.crew || [])
      .filter((c: CreditResponse) => c.role === AuthorType.Director)
      .slice(0, LIMIT_DIRECTORS)
      .map((c: CreditResponse) => ({
        '@type': 'Person',
        name: c.person.name,
      })) || undefined;

  const actor =
    (media.crew || [])
      .filter(
        (c: CreditResponse) =>
          c.role === AuthorType.Actor || c.role === AuthorType.VoiceActor
      )
      .slice(0, LIMIT_ACTORS)
      .map((c: CreditResponse) => ({
        '@type': 'Person',
        name: c.person.name,
      })) || undefined;

  const structuredDataBase: object = {
    '@context': 'https://schema.org',
    '@type': media.mediaType === MediaType.Film ? 'Movie' : 'TVSeries',
    name: media.name,
    description,
    url,
    image: imageUrl,
    director,
    actor,
    aggregateRating,
    genre: genre.length > 0 ? genre : undefined,
    duration: media.runtime ? `PT${media.runtime}M` : undefined,
    productionCountry:
      media.country?.[0] !== 'UNKNOWN'
        ? {
            '@type': 'Country',
            name: Country[media.country[0]] || media.country[0],
            code: media.country[0],
          }
        : undefined,
  };

  let structuredData: object = { ...structuredDataBase };
  if (media.mediaType === MediaType.Film) {
    const formattedReleaseDate = media.releaseDate ?? undefined;
    structuredData = { ...structuredData, datePublished: formattedReleaseDate };
  }

  return {
    title: `${media.name} (${mediaTypeToDisplayName(media.mediaType)})`,
    description,
    url,
    imageUrl,
    type: media.mediaType === MediaType.Film ? 'movie' : 'tvShow',
    structuredData,
  };
};

const buildFilmSEO = (film: FilmResponse): SEOData => {
  return buildBaseMediaSEO(film);
};

const buildShowSEO = (show: ShowResponse): SEOData => {
  const baseSeo = buildBaseMediaSEO(show);

  const creator =
    (show.crew || [])
      .filter((c: CreditResponse) => c.role === AuthorType.Creator)
      .slice(0, LIMIT_CREATORS)
      .map((c: CreditResponse) => ({
        '@type': 'Person',
        name: c.person.name,
      })) || undefined;

  const formattedStartDate: string | undefined = show.releaseDate ?? undefined;
  const formattedEndDate: string | undefined = show.lastAirDate ?? undefined;
  const numberOfSeasons: number =
    show.seasons?.filter((s: SeasonResponse) => !isSpecialSeason(s)).length ||
    0;
  const numberOfEpisodes = show.episodeCount || 0;

  const updatedStructuredData: object = {
    ...baseSeo.structuredData,
    creator,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    numberOfSeasons: numberOfSeasons > 0 ? numberOfSeasons : undefined,
    numberOfEpisodes: numberOfEpisodes > 0 ? numberOfEpisodes : undefined,
  };

  return {
    ...baseSeo,
    structuredData: updatedStructuredData,
  };
};

export const buildMediaSeo = (media: MediaResponse): SEOData => {
  if (media.mediaType === MediaType.Film) {
    return buildFilmSEO(media);
  }
  if (media.mediaType === MediaType.Show) {
    return buildShowSEO(media);
  }
  return buildBaseMediaSEO(media);
};
