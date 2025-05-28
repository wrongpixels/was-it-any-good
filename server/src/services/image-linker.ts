import { TMDB_MEDIA_URL } from '../util/config';

const AVATAR_URL: string = `${TMDB_MEDIA_URL}/w138_and_h175_face`;
const POSTER_URL: string = `${TMDB_MEDIA_URL}/w220_and_h330_face`;
const STUDIO_URL: string = `${TMDB_MEDIA_URL}/w200`;

const createAvatarURL = (path: string): string => `${AVATAR_URL}${path}`;
const createPosterURL = (path: string): string => `${POSTER_URL}${path}`;
const createStudioImageURL = (path: string): string => `${STUDIO_URL}${path}`;

export default { createAvatarURL, createPosterURL, createStudioImageURL };
