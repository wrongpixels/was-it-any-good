import { MediaResponse, MediaRoleResponse } from './models';

export enum AuthorType {
  Director = 'Director',
  Writer = 'Writer',
  Creator = 'Creator',
  Producer = 'Producer',
  ExecProducer = 'Executive Producer',
  MusicComposer = 'Original Music Composer',
  Actor = 'Actor',
  VoiceActor = 'Voice Actor',
  Unknown = 'Unknown',
}

export const authorOrder: AuthorType[] = [
  AuthorType.Creator,
  AuthorType.Director,
  AuthorType.Writer,
  AuthorType.Actor,
  AuthorType.VoiceActor,
  AuthorType.Producer,
  AuthorType.MusicComposer,
];

export interface SortedRoles {
  mainRoles: AuthorType[];
  mediaByRole: AuthorMedia[];
}

export interface AuthorMedia {
  authorType: AuthorType;
  mediaRoles: MediaRoleResponse[];
}

//a special combined version of all the roles of the person in a single media
export interface MergedPersonMediaRole {
  media: MediaResponse;
  authorType: AuthorType[];
  characterName: string[];
}
