const DEF_PAGE_TITLE = 'WIAG';
const DEF_PAGE_DESCRIPTION = '';

const getCurrentTitle = (): string | undefined => {
  const t = document.title;
  if (!t || t === DEF_PAGE_TITLE) return undefined;
  const suffix = ` | ${DEF_PAGE_TITLE}`;
  return t.endsWith(suffix) ? t.slice(0, -suffix.length) : t;
};

const getCurrentDescription = (): string | undefined => {
  const meta = document.querySelector(
    "meta[name='description']"
  ) as HTMLMetaElement | null;
  const c = meta?.content;
  return c && c !== DEF_PAGE_DESCRIPTION ? c : undefined;
};

export const setTitle = (newTitle?: string): void => {
  const base = newTitle ?? getCurrentTitle() ?? DEF_PAGE_TITLE;
  document.title =
    base === DEF_PAGE_TITLE ? DEF_PAGE_TITLE : `${base} | ${DEF_PAGE_TITLE}`;
  console.log(document.title);
};

export const setDescription = (newDescription?: string): void => {
  const desc =
    newDescription ?? getCurrentDescription() ?? DEF_PAGE_DESCRIPTION;
  let meta = document.querySelector(
    "meta[name='description']"
  ) as HTMLMetaElement | null;
  if (meta) {
    meta.content = desc;
  } else if (desc) {
    const m = document.createElement('meta') as HTMLMetaElement;
    m.name = 'description';
    m.content = desc;
    document.head.appendChild(m);
  }
};

export const setPageInfo = (info: {
  title?: string;
  description?: string;
}): void => {
  setTitle(info.title);
  setDescription(info.description);
};
