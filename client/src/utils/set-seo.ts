import { BASE_URL } from '../../../shared/constants/url-constants';
import { joinUrl } from '../../../shared/helpers/format-helper';

export const DEF_PAGE_TITLE: string = 'WIAG';
export const DEF_PAGE_DESCRIPTION: string =
  'Explore Films, Shows... and all the people who make them possible.';
export const ICON_URL: string = joinUrl(BASE_URL, 'favicon.svg');

export interface SEOData {
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  type?: string;

  structuredData?: object | null;
}

//generates a default WebPage schema for pages without specific structured data
const createDefaultPageSchema = (
  title: string,
  description: string,
  url: string
): object => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description: description,
  url: url,
  isPartOf: {
    '@id': `${BASE_URL}/#website`,
  },
});

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

//removes any previous dynamic schema script and injects the new one for the current page.
const updateStructuredDataScripts = (schema: object | null | undefined) => {
  //the data attribute helps us find and remove only the scripts we've added dynamically
  const existingScripts = document.head.querySelectorAll(
    'script[data-seo-script="true"]'
  );
  existingScripts.forEach((script) => document.head.removeChild(script));

  if (schema) {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo-script', 'true');
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
  }
};

//our main SEO setter. it updates all page-specific metadata, from the title and description to the dynamic structured data.
export const setSEO = (seo: SEOData = {}) => {
  const newSeo = {
    title: seo.title || DEF_PAGE_TITLE,
    description: seo.description || DEF_PAGE_DESCRIPTION,
    url: seo.url || BASE_URL,
    imageUrl: seo.imageUrl || ICON_URL,
    type: seo.type || 'website',
  };

  const pageTitle =
    newSeo.title === DEF_PAGE_TITLE ? DEF_PAGE_TITLE : `${newSeo.title} | WIAG`;

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

  let pageSchema: object | null | undefined = seo.structuredData;

  //if no structured data was provided, we create a default WebPage schema for it.
  if (seo.structuredData === undefined) {
    pageSchema = createDefaultPageSchema(
      pageTitle,
      newSeo.description,
      newSeo.url
    );
  }

  updateStructuredDataScripts(pageSchema);
};
