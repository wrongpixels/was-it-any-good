import { MediaResponse } from "./models";

export enum AuthorType {
  Director = "Director",
  Writer = "Writer",
  Creator = "Creator",
  Producer = "Producer",
  ExecProducer = "Executive Producer",
  MusicComposer = "Original Music Composer",
  Actor = "Actor",
  Unknown = "Unknown",
}

export const authorOrder: AuthorType[] = [
  AuthorType.Creator,
  AuthorType.Director,
  AuthorType.Writer,
  AuthorType.Actor,
  AuthorType.Producer,
  AuthorType.MusicComposer,
];

export interface SortedRoles {
  mainRoles: AuthorType[];
  mediaByRole: AuthorMedia[];
}

export interface AuthorMedia {
  authorType: AuthorType;
  media: MediaResponse[];
}
