import type { Metadata } from "next";
import { SITE } from "./site";

/** Absolute canonical URL on https://www.kerurdan.co.il */
export function canonicalUrl(path = "/"): string {
  if (!path || path === "/") return SITE.url;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${normalized}`;
}

export function withCanonical(path: string, metadata: Metadata): Metadata {
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: canonicalUrl(path),
    },
  };
}
