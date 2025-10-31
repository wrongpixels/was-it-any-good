import {
  DEF_PAGE_DESCRIPTION,
  DEF_PAGE_TITLE,
  DEF_URL,
} from '../utils/page-info-setter';
import { joinUrl } from '../../../shared/helpers/format-helper';

export interface SeoData {
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  type?: string;
  structuredData?: object | null;
}

const defaultSeo: Required<Omit<SeoData, 'structuredData'>> & {
  structuredData?: object | null;
} = {
  title: DEF_PAGE_TITLE,
  description: DEF_PAGE_DESCRIPTION,
  url: DEF_URL,
  imageUrl: joinUrl(DEF_URL, 'favicon.svg'),
  type: 'website',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: DEF_URL,
    name: DEF_PAGE_TITLE,
  },
};

const getElementBySelector = (selector: string): Element | null =>
  document.head.querySelector(selector);

const replaceMetaTag = (
  attribute: 'name' | 'property',
  value: string,
  content?: string | null
) => {
  let element: Element | null = getElementBySelector(
    `meta[${attribute}="${value}"]`
  );

  if (!content) {
    if (element) {
      document.head.removeChild(element);
    }
    return;
  }

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const replaceLinkTag = (rel: string, href?: string | null) => {
  let element: Element | null = getElementBySelector(`link[rel="${rel}"]`);

  if (!href) {
    if (element) {
      document.head.removeChild(element);
    }
    return;
  }

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const replaceStructuredData = (data?: object | null) => {
  let element: Element | null = getElementBySelector(
    'script[type="application/ld+json"]'
  );

  if (!data) {
    if (element) {
      document.head.removeChild(element);
    }
    return;
  }

  if (!element) {
    element = document.createElement('script');
    element.setAttribute('type', 'application/ld+json');
    document.head.appendChild(element);
  }
  element.innerHTML = JSON.stringify(data);
};

export const setSeo = (seo: SeoData) => {
  const newSeo: SeoData = { ...defaultSeo, ...seo };
  const pageTitle =
    newSeo.title === defaultSeo.title
      ? defaultSeo.title
      : `${newSeo.title} | WIAG`;

  document.title = pageTitle;
  replaceMetaTag('name', 'description', newSeo.description);
  replaceLinkTag('canonical', newSeo.url);
  replaceMetaTag('property', 'og:title', pageTitle);
  replaceMetaTag('property', 'og:description', newSeo.description);
  replaceMetaTag('property', 'og:url', newSeo.url);
  replaceMetaTag('property', 'og:image', newSeo.imageUrl);
  replaceMetaTag('property', 'og:type', newSeo.type);

  replaceMetaTag(
    'name',
    'twitter:card',
    newSeo.imageUrl ? 'summary_large_image' : 'summary'
  );
  replaceMetaTag('name', 'twitter:title', pageTitle);
  replaceMetaTag('name', 'twitter:description', newSeo.description);
  replaceMetaTag('name', 'twitter:image', newSeo.imageUrl);
  replaceStructuredData(newSeo.structuredData);
};
