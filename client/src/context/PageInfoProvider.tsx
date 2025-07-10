import { createContext, useEffect, useState } from 'react';
import { ChildrenProps } from '../../../shared/types/common';

export interface PageInfo {
  title?: string;
  description?: string;
}

const DEF_PAGE_TITLE = 'WIAG';
const DEF_PAGE_DESCRIPTION = '';

const DEF_PAGE_INFO: PageInfo = {
  title: DEF_PAGE_TITLE,
  description: DEF_PAGE_DESCRIPTION,
};

export interface PageInfoContextValues {
  setPageInfo: (pageInfo: PageInfo) => void;
  setTitle: (title: string | undefined) => void;
  setDescription: (description: string | undefined) => void;
}

export const PageInfoContext = createContext<PageInfoContextValues | null>(
  null
);

export const PageInfoProvider = ({ children }: ChildrenProps) => {
  const [info, setInfo] = useState<PageInfo>(DEF_PAGE_INFO);

  const setPageInfo = ({ title: newTitle, description }: PageInfo) => {
    const title =
      newTitle === undefined && description
        ? (info.title ?? DEF_PAGE_TITLE)
        : (newTitle ?? DEF_PAGE_TITLE);

    setInfo((prev) =>
      prev.title === title && prev.description === description
        ? prev
        : { title, description }
    );
  };

  const setTitle = (newTitle: string | undefined) => {
    const title = newTitle ?? DEF_PAGE_TITLE;
    setInfo((prev) =>
      prev.title === title && prev.description === undefined
        ? prev
        : { title, description: undefined }
    );
  };

  const setDescription = (newDescription: string | undefined) => {
    setInfo((prev) =>
      prev.description === newDescription
        ? prev
        : {
            title: prev.title ?? DEF_PAGE_TITLE,
            description: newDescription,
          }
    );
  };

  useEffect(() => {
    document.title =
      info.title === DEF_PAGE_TITLE
        ? DEF_PAGE_TITLE
        : `${info.title} | ${DEF_PAGE_TITLE}`;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', info.description ?? '');
    } else if (info.description) {
      const newDescription = document.createElement('meta');
      newDescription.name = 'description';
      newDescription.content = info.description;
      document.head.appendChild(newDescription);
    }
  }, [info]);

  return (
    <PageInfoContext.Provider value={{ setPageInfo, setTitle, setDescription }}>
      {children}
    </PageInfoContext.Provider>
  );
};
