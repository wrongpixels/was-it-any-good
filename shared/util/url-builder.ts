import { BASE_API } from '../constants/url-constants'
import { slugifyUrl } from '../helpers/format-helper'
import { MediaType } from '../types/media'
import {
  IndexMediaData,
  MediaResponse,
  PersonResponse,
  RatingData,
} from '../types/models'

//our shared logic to build links inside the webpage
export const apiPaths = {
  films: {
    base: `${BASE_API}/films`,
    byId: (id: number | string, slug?: string) =>
      `${apiPaths.films.base}/${id}${slug ? `/${slug}` : ''}`,
    byTMDBId: (id: number | string) => `${apiPaths.films.base}/tmdb/${id}`,
  },
  shows: {
    base: `${BASE_API}/shows`,
    byId: (id: number | string, slug?: string) =>
      `${apiPaths.shows.base}/${id}${slug ? `/${slug}` : ''}`,
    byTMDBId: (id: number | string) => `${apiPaths.shows.base}/tmdb/${id}`,
  },
  people: {
    base: `${BASE_API}/people`,
    byId: (id: number | string, slug?: string) =>
      `${apiPaths.people.base}/${id}${slug ? `/${slug}` : ''}`,
  },
  genres: {
    base: `${BASE_API}/genres`,
    byId: (id: number | string) => `${apiPaths.genres.base}/${id}`,
  },
  ratings: {
    base: `${BASE_API}/ratings`,
    matchById: (mediaType: MediaType, id: number) =>
      `${apiPaths.ratings.base}/match/${mediaType.toLowerCase()}/${id}`,
    byId: (id: number | string) => `${apiPaths.ratings.base}/${id}`,
  },
  users: {
    base: `${BASE_API}/users`,
    byId: (id: number | string) => `${apiPaths.users.base}/${id}`,
  },
  userReviews: {
    base: `${BASE_API}/user-reviews`,
    byIndexId: (id: number | string) => `${apiPaths.userReviews.base}/${id}`,
  },
  auth: {
    base: `${BASE_API}/auth`,
    login: () => `${apiPaths.auth.base}/login`,
    logout: () => `${apiPaths.auth.base}/logout`,
    sessions: {
      base: () => `${apiPaths.auth.base}/sessions`,
      verify: () => `${apiPaths.auth.sessions.base()}/verify`,
    },
  },
  suggestions: {
    base: `${BASE_API}/suggest`,
    byInput: (input: string) =>
      `${apiPaths.suggestions.base}?${new URLSearchParams({ query: input })}`,
  },
  search: {
    base: `${BASE_API}/search`,
    byQuery: (query: string) => `${apiPaths.search.base}?${query}`,
  },

  trending: {
    base: `${BASE_API}/trending`,
    byPage: (page: number) => `${apiPaths.trending.base}?page=${page}`,
  },
  browse: {
    base: `${BASE_API}/browse`,
    byQuery: (query: string) => `${apiPaths.browse.base}?${query}`,
  },
  my: {
    base: `${BASE_API}/my`,
    votes: {
      base: () => `${apiPaths.my.base}/votes`,
      byQuery: (query: string) => `${apiPaths.my.votes.base()}?${query}`,
    },
    userReviews: {
      byIndexId: (id: string | number) =>
        `${apiPaths.my.base}/user-reviews/${id}`,
    },
  },
  watchlist: {
    base: `${BASE_API}/lists/watchlist`,
    my: () => `${apiPaths.watchlist.base}/my`,
    getFromUserId: (userId: number, query: string) =>
      `${apiPaths.watchlist.base}/${userId}/${query}`,
    getFromActiveUser: (query?: string) =>
      `${apiPaths.watchlist.base}/my?${query}`,

    toggleIndexMedia: (userId: number, indexId: number) =>
      `${apiPaths.watchlist.base}/${userId}/${indexId}`,
  },
}
export const clientPaths = {
  home: '/',
  films: {
    base: '/film',
    page: '/films',
    idRoute: () => `${clientPaths.films.base}/:id/:slug?`,
    TMDBIdParam: () => `/tmdb${clientPaths.films.base}/:id/:slug?`,
    byId: (id: number | string) => `${clientPaths.films.base}/${id}`,
    byTMDBId: (id: number | string) => `/tmdb${clientPaths.films.byId(id)}`,
  },
  shows: {
    base: '/show',
    page: '/shows',
    idRoute: () => `${clientPaths.shows.base}/:id/:slug?`,
    TMDBIdParam: () => `/tmdb${clientPaths.shows.base}/:id/:slug?`,
    byId: (id: number | string) => `${clientPaths.shows.base}/${id}`,
    byTMDBId: (id: number | string) => `/tmdb${clientPaths.shows.byId(id)}`,
  },
  people: {
    base: '/person',
    idRoute: () => `${clientPaths.people.base}/:id/:slug?`,
    byId: (id: number | string, slug?: string) =>
      `${clientPaths.people.base}/${id}${slug ? `/${slug}` : ''}`,
  },
  users: {
    base: '/user',
    withParam: () => `${clientPaths.users.base}/:id`,
    byId: (id: number | string) => `${clientPaths.users.base}/${id}`,
  },
  search: {
    base: `/search`,
    query: () => `${clientPaths.search.base}?`,
    byQuery: (query: string) => `${clientPaths.search.query()}${query}`,
    byTerm: (term: number | string) => `${clientPaths.search.query()}q=${term}`,
  },
  browse: {
    base: '/browse',
    query: () => `${clientPaths.browse.base}?`,
    byQuery: (query: string) => `${clientPaths.browse.query()}${query}`,
  },
  tops: {
    base: '/top',
    shows: {
      base: () => `${clientPaths.tops.base}/shows`,
      query: () => `${clientPaths.tops.shows.base()}?`,
      withQuery: (query: string) => `${clientPaths.tops.shows.query()}${query}`,
    },
    films: {
      base: () => `${clientPaths.tops.base}/films`,
      query: () => `${clientPaths.tops.films.base()}?`,
      withQuery: (query: string) => `${clientPaths.tops.films.query()}${query}`,
    },
    multi: {
      base: () => `${clientPaths.tops.base}/media`,
      query: () => `${clientPaths.tops.multi.base()}?`,
      withQuery: (query: string) => `${clientPaths.tops.multi.query()}${query}`,
    },
  },
  popular: {
    base: '/popular',
    shows: {
      base: () => `${clientPaths.popular.base}/shows`,
      query: () => `${clientPaths.popular.shows.base()}?`,
      withQuery: (query: string) =>
        `${clientPaths.popular.shows.query()}${query}`,
    },
    films: {
      base: () => `${clientPaths.popular.base}/films`,
      query: () => `${clientPaths.popular.films.base()}?`,
      withQuery: (query: string) =>
        `${clientPaths.popular.films.query()}${query}`,
    },
    multi: {
      base: () => `${clientPaths.popular.base}/media`,
      query: () => `${clientPaths.popular.multi.base()}?`,
      withQuery: (query: string) =>
        `${clientPaths.popular.multi.query()}${query}`,
    },
  },
  my: {
    base: '/my',
    votes: {
      base: () => `${clientPaths.my.base}/votes`,
      query: () => `${clientPaths.my.votes.base}?`,
      byQuery: (query: string) => `${clientPaths.my.votes.query()}${query}`,
    },
    watchlist: {
      base: () => `${clientPaths.my.base}/watchlist`,
      query: () => `${clientPaths.my.watchlist.base}?`,
      byQuery: (query: string) => `${clientPaths.my.watchlist.query()}${query}`,
    },
  },
  trending: {
    base: '/trending',
    shows: {
      base: () => `${clientPaths.trending.base}/shows`,
      query: () => `${clientPaths.trending.shows.base()}?`,
      withQuery: (query: string) =>
        `${clientPaths.trending.shows.query()}${query}`,
    },
    films: {
      base: () => `${clientPaths.trending.base}/films`,
      query: () => `${clientPaths.trending.films.base()}?`,
      withQuery: (query: string) =>
        `${clientPaths.trending.films.query()}${query}`,
    },
    multi: {
      base: () => `${clientPaths.trending.base}/media`,
      query: () => `${clientPaths.trending.multi.base()}?`,
      withQuery: (query: string) =>
        `${clientPaths.trending.multi.query()}${query}`,
    },
  },
}

export const mediaPaths = {
  countries: {
    base: '/flags',
    byCode: (code: string) =>
      `${mediaPaths.countries.base}/${code.toLowerCase()}.svg`,
  },
}

export const buildMediaLinkWithSlug = (media: MediaResponse) => {
  return slugifyUrl(buildClientMediaLink(media.mediaType, media.id), media.name)
}

export const buildPersonLinkWithSlug = (person: PersonResponse) => {
  return slugifyUrl(clientPaths.people.byId(person.id), person.name)
}

export const getMediaFromIndexMedia = (indexMedia: IndexMediaData) => {
  if (!indexMedia.addedToMedia) {
    return null
  }
  switch (indexMedia.mediaType) {
    case MediaType.Film:
      return indexMedia.film ?? null

    case MediaType.Show:
      return indexMedia.show ?? null
    case MediaType.Season:
      return indexMedia.season ?? null
    default:
      return null
  }
}

export const getMediaIdFromIndexMedia = (
  indexMedia: IndexMediaData,
): number | null => {
  if (!indexMedia.addedToMedia) {
    return null
  }
  return getMediaFromIndexMedia(indexMedia)?.id || null
}

export const buildIndexMediaLinkWithSlug = (im: IndexMediaData): string => {
  const mediaId: number | null = getMediaIdFromIndexMedia(im)
  const url: string = mediaId
    ? buildClientMediaLink(im.mediaType, mediaId)
    : buildClientMediaLink(im.mediaType, im.tmdbId, true)

  return slugifyUrl(url, im.name)
}

export const buildClientMediaLink = (
  mediaType: MediaType,
  id?: number | string,
  useTMDB?: boolean,
): string => {
  switch (mediaType) {
    case MediaType.Film:
      return !id
        ? clientPaths.films.base
        : useTMDB
          ? clientPaths.films.byTMDBId(id)
          : clientPaths.films.byId(id)
    case MediaType.Show:
      return !id
        ? clientPaths.shows.base
        : useTMDB
          ? clientPaths.shows.byTMDBId(id)
          : clientPaths.shows.byId(id)
    case MediaType.Season:
      return !id
        ? clientPaths.shows.base
        : useTMDB
          ? clientPaths.shows.byTMDBId(id)
          : clientPaths.shows.byId(id)
    default:
      throw new Error(`Unsupported media type: ${mediaType}`)
  }
}

export const urlFromRatingData = (rating: RatingData): string => {
  return buildClientMediaLink(
    rating.mediaType,
    rating.mediaType === MediaType.Season ? rating.showId : rating.mediaId,
  )
}
