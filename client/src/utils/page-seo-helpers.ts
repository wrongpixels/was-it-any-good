import { joinUrl, slugifyUrl } from '../../../shared/helpers/format-helper';
import Country from '../../../shared/types/countries';
import { MediaType } from '../../../shared/types/media';
import {
  CreditResponse,
  FilmResponse,
  GenreResponse,
  IndexMediaData,
  MediaResponse,
  PersonResponse,
  SeasonResponse,
  ShowResponse,
} from '../../../shared/types/models';
import { AuthorType } from '../../../shared/types/roles';
import imageLinker from '../../../shared/util/image-linker';
import { SEOData, setSEO } from './set-seo';
import { PersonDetailsValues } from './person-details-builder';
import { isSpecialSeason } from './seasons-setter';
import {
  buildIMDBUrlForMedia,
  buildTMDBUrlForIndexMedia,
  buildTMDBUrlForMedia,
  mediaTypeToDisplayName,
} from './url-helper';
import { getAnyMediaDisplayRating } from './ratings-helper';
import {
  BASE_URL,
  TMDB_PERSON_URL,
} from '../../../shared/constants/url-constants';
import {
  clientPaths,
  buildMediaLinkWithSlug,
  buildIndexMediaLinkWithSlug,
} from '../../../shared/util/url-builder';
import { getIndexMediaGenres } from './index-media-helper';
import { SEOListType } from '../types/seo-types';
import { BasePageRoutes } from '../constants/search-browse-constants';

const LIMIT_DIRECTORS: number = 3;
const LIMIT_CREATORS: number = 3;
const LIMIT_ACTORS: number = 7;
const LIMIT_LISTS: number = 20;

export const buildPersonSEO = (
  person: PersonResponse,
  personDetails: PersonDetailsValues
): SEOData => {
  const url: string = joinUrl(
    BASE_URL,
    slugifyUrl(clientPaths.people.byId(person.id), person.name)
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
      sameAs: person.tmdbId ? [joinUrl(TMDB_PERSON_URL, person.tmdbId)] : [],
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
  const url: string = joinUrl(BASE_URL, buildMediaLinkWithSlug(media));
  const imageUrl: string = imageLinker.getPosterImage(media.image);
  const description: string = safeTruncate(media.description, 150);
  const genre: string[] = getGenresAsStringArray(media.genres);
  const sameAs: string[] = media.tmdbId ? [buildTMDBUrlForMedia(media)] : [];
  if (media.imdbId) {
    sameAs.push(buildIMDBUrlForMedia(media));
  }

  let aggregateRating: object | undefined;
  const mediaAverage: number = getAnyMediaDisplayRating(media);
  if (mediaAverage > 0 && media.voteCount > 0) {
    aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: mediaAverage,
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
    (media.cast || [])
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
    sameAs,
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

export const buildSearchSeo = (
  searchTerm: string | null,
  query: string
): SEOData => {
  const url: string = searchTerm
    ? `${BASE_URL}/search?${query}`
    : `${BASE_URL}/search`;

  return {
    title: `${searchTerm ? `${searchTerm} - ` : ''}Search`,
    description: searchTerm
      ? `Showing Search results for ${searchTerm}`
      : 'Search for any Film or TV Show!',
    url,
    structuredData: searchTerm
      ? {
          '@context': 'https://schema.org',
          '@type': 'SearchResultsPage',
          name: `Search results for "${searchTerm}"`,
          url,
          isPartOf: {
            '@id': `${BASE_URL}/#website`,
          },
        }
      : undefined,
  };
};

//to build the HomePage data and its nested Trending list
export const buildHomepageTrendingSeo = (
  allItems?: IndexMediaData[]
): SEOData => {
  return buildMediaListPageSeo({
    url: `${BASE_URL}/`,
    title: 'WIAG: The Media Database that builds itself',
    description:
      'Explore trending Films and TV Shows, rate them, and find your next favorite thing!',
    allItems,
  });
};

interface SetBrowsePageSeoValues {
  title: string;
  page?: number;
  allItems?: IndexMediaData[];
}

//to build a builtin media collection schema by BasePageRoute or just set the tile
export const setBrowsePageSeo = ({
  title,
  page = 1,
  allItems,
}: SetBrowsePageSeoValues): void => {
  switch (title) {
    case BasePageRoutes.Films:
      setSEO(buildFilmsPageSeo(page, allItems));
      break;
    case BasePageRoutes.Shows:
      setSEO(buildShowsPageSeo(page, allItems));
      break;
    case BasePageRoutes.TopMedia:
      setSEO(buildTopMediaPageSeo(page, allItems));
      break;
    //if it's not a built in PageRoute, we simply set the title
    default:
      setSEO({
        title: title,
      });
  }
};

//to build the Best Films data and its nested Trending list
export const buildFilmsPageSeo = (
  page: number,
  allItems?: IndexMediaData[]
): SEOData => {
  return buildMediaListPageSeo({
    url: `${BASE_URL}${clientPaths.films.page}`,
    title: applyPageToTitle(BasePageRoutes.Films, page),
    description: 'Explore, rate and sort the best Films available on WIAG!',
    allItems,
    seoListType: 'Movie',
  });
};

//to build the Best TV Shows data and its nested Trending list
export const buildShowsPageSeo = (
  page: number,
  allItems?: IndexMediaData[]
): SEOData => {
  return buildMediaListPageSeo({
    url: `${BASE_URL}${clientPaths.shows.page}`,
    title: applyPageToTitle(BasePageRoutes.Shows, page),
    description: 'Explore, rate and sort the best TV Shows available on WIAG!',
    allItems,
    seoListType: 'TVSeries',
  });
};

//to build the Best Media data and its nested Trending list
export const buildTopMediaPageSeo = (
  page: number,
  allItems?: IndexMediaData[]
): SEOData => {
  return buildMediaListPageSeo({
    url: `${BASE_URL}${clientPaths.tops.multi.base()}`,
    title: applyPageToTitle(BasePageRoutes.TopMedia, page),
    description: 'Explore, rate and sort the best media available on WIAG!',
    allItems,
  });
};

const applyPageToTitle = (title: string, page: number) =>
  `${title}${page > 1 ? ` (Page ${page})` : ''}`;

interface BuildMediaListSeoValues {
  title: string;
  description: string;
  url: string;
  allItems?: IndexMediaData[];
  seoListType?: SEOListType;
}

const buildMediaListPageSeo = ({
  title,
  description,
  url,
  allItems,
  seoListType,
}: BuildMediaListSeoValues) => {
  return {
    title,
    description,
    url,
    imageUrl: `${BASE_URL}/og-image.png`,
    type: 'website',
    structuredData: buildMediaListSchema(
      title,
      description,
      url,
      allItems,
      seoListType
    ),
  };
};

const buildMediaListSchema = (
  title: string,
  description: string,
  url: string,
  allItems?: IndexMediaData[],
  seoListType: SEOListType = 'Mixed'
): object | undefined => {
  let itemListElements: object[] | undefined = undefined;

  if (allItems) {
    //we build the schema for each element of the list adding as much info as we can
    const limitItems: IndexMediaData[] = allItems.slice(0, LIMIT_LISTS);
    itemListElements = limitItems.map((item: IndexMediaData, index: number) => {
      const itemUrl: string = joinUrl(
        BASE_URL,
        buildIndexMediaLinkWithSlug(item)
      );
      const sameAs: string[] = item.tmdbId
        ? [buildTMDBUrlForIndexMedia(item)]
        : [];

      const genre: string[] = getIndexMediaGenresAsStringArray(item);
      let aggregateRating: object | undefined;
      const average: number = getAnyMediaDisplayRating(item);
      if (average > 0 && item.voteCount > 0) {
        aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: average,
          bestRating: 10,
          worstRating: 1,
          ratingCount: item.voteCount,
        };
      }
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': item.mediaType === MediaType.Film ? 'Movie' : 'TVSeries',
          genre,
          name: item.name,
          url: itemUrl,
          image: imageLinker.getPosterImage(item.image),
          sameAs: sameAs.length > 0 ? sameAs : undefined,
          aggregateRating: aggregateRating,
        },
      };
    });
    //and then we build the whole collection's schema itself
    const collectionPageSchema: object = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      //if it's a specific type of list, we add the specific 'about' section for the collection
      about:
        seoListType === 'Mixed'
          ? undefined
          : {
              '@type': 'Thing',
              name: seoListType === 'TVSeries' ? 'TV Series' : seoListType,
              '@id': `https://schema.org/${seoListType}`,
            },

      isPartOf: {
        '@id': `${BASE_URL}/#website`,
      },
      mainEntity: {
        '@type': 'ItemList',
        name: title,
        itemListOrder: 'https://schema.org/Descending',
        numberOfItems: itemListElements.length,
        itemListElement: itemListElements,
      },
    };
    return collectionPageSchema;
  }
};

const getGenresAsStringArray = (
  genres: GenreResponse[] | undefined
): string[] => genres?.map((g: GenreResponse) => g.name) || [];

const getIndexMediaGenresAsStringArray = (
  indexMedia: IndexMediaData
): string[] => {
  const genres: GenreResponse[] | null = getIndexMediaGenres(indexMedia);
  if (!genres) {
    return [];
  }
  return getGenresAsStringArray(genres);
};
