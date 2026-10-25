import type { Product } from "./types";
import { canonicalUrl } from "./metadata";
import { SITE } from "./site";

const ORG_DESCRIPTION =
  "קירור דן – מעל 30 שנה בענף הקירור. ייבוא, שיווק, אספקה והתקנה של ציוד קירור מסחרי ותעשייתי לעסקים בישראל: חלביות, מעדניות, מקררים ומקפיאים.";

export function siteOrganizationJsonLd() {
  const logo = `${SITE.url}/kerur-dan-logo.png`;
  const shared = {
    name: SITE.name,
    url: SITE.url,
    logo,
    telephone: "+972-58-677-6545",
    description: ORG_DESCRIPTION,
    sameAs: [SITE.facebook, SITE.instagram],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        ...shared,
      },
      {
        "@type": "LocalBusiness",
        ...shared,
        address: {
          "@type": "PostalAddress",
          streetAddress: "תוצרת הארץ 38",
          addressLocality: "באר שבע",
          addressCountry: "IL",
        },
        areaServed: {
          "@type": "Country",
          name: "IL",
        },
      },
    ],
  };
}

type BreadcrumbItem = { href?: string; label: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: canonicalUrl(item.href) } : {}),
    })),
  };
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/kerur-dan-logo.png`,
      },
    },
    mainEntityOfPage: canonicalUrl(`/guides/${input.slug}`),
    url: canonicalUrl(`/guides/${input.slug}`),
  };
}

export function faqPageJsonLd(faq: { question: string; answer: string }[]) {
  if (!faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function productJsonLd(product: Product) {
  const image = product.images[0]?.src;
  const description = product.description?.replace(/\s+/g, " ").trim().slice(0, 500);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(image ? { image } : {}),
    ...(description ? { description } : {}),
    brand: {
      "@type": "Brand",
      name: product.specs.find((row) => row.label === "מותג")?.value ?? SITE.name,
    },
    category: product.categoryName,
    url: canonicalUrl(`/product/${product.slug}`),
  };
}
