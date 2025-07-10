import { useEffect } from 'react';
import { MediaResponse } from '../../../shared/types/models';

export const usePageMediaTitle = (
  media: MediaResponse | undefined,
  description?: string
) =>
  usePageTitle(
    media ? `${media.name} (${media.mediaType})` : undefined,
    description
  );

export const usePageTitle = (
  title: string | undefined,
  description?: string
) => {
  useEffect(() => {
    document.title = title ? `${title} | WIAG` : 'WIAG';
    const metaDescription = document.querySelector("meta[name='description']");
    if (!description) {
      if (metaDescription) {
        metaDescription.setAttribute('content', '');
      }
      return;
    }
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [title, description]);
};
