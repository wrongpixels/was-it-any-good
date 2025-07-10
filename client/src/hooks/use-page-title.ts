import { useEffect } from 'react';
import { MediaResponse } from '../../../shared/types/models';

export interface PageTitleValues {
  setTitle: (newTitle: string | undefined) => void;
  setDescription: (newDescription: string | undefined) => void;
}

const setTitle = (newTitle: string | undefined): void => {
  document.title = newTitle ? `${newTitle} | WIAG` : 'WIAG';
};
const setDescription = (newDescription: string | undefined): void => {
  const metaDescription = document.querySelector("meta[name='description']");
  if (!newDescription) {
    if (metaDescription) {
      metaDescription.setAttribute('content', '');
    }
    return;
  }
  if (metaDescription) {
    metaDescription.setAttribute('content', newDescription);
  } else {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = newDescription;
    document.head.appendChild(meta);
  }
};

export const usePageMediaTitle = (
  media: MediaResponse | undefined | null,
  description?: string
): PageTitleValues =>
  usePageTitle(
    media ? `${media.name} (${media.mediaType})` : undefined,
    description
  );

export const usePageTitle = (
  title: string | undefined,
  description?: string
): PageTitleValues => {
  useEffect(() => {
    setTitle(title);
    setDescription(description);
  }, [title, description]);
  return { setTitle, setDescription };
};
