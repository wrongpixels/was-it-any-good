import z from 'zod';
import { MediaType } from '../../../shared/types/media';

//the schemas to parse the expected format when creating/removing lists
//and when adding/removing media of an existing list

export const CreateListSchema = z.object({
  name: z.string(),
  description: z.string(),
  indexInUserLists: z.number(),
  mediaTypes: z.array(z.nativeEnum(MediaType)),
  private: z.boolean(),
  autoCleanItems: z.boolean(),
});

export const RemoveListSchema = z.object({
  id: z.number(),
  canBeModified: z.boolean(),
});

export const AddMediaToListSchema = z.object({
  indexInList: z.number().optional(),
  userListId: z.number(),
  indexId: z.number(),
});

export const RemoveMediaFromListSchema = z.object({
  userListId: z.number(),
  indexId: z.number(),
});

export type CreateList = z.infer<typeof CreateListSchema>;
export type RemoveList = z.infer<typeof CreateListSchema>;

export type AddMediaToList = z.infer<typeof AddMediaToListSchema>;
export type RemoveMediaFromList = z.infer<typeof RemoveMediaFromListSchema>;
