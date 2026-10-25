import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { categories, sitemapProductEntries } from "@/lib/data";
import { getAllGuides } from "@/lib/guides";
import { SITE } from "@/lib/site";

export const revalidate = 120;

const STATIC_ROUTES = [
  "",
  "/catalog",
  "/solutions",
  "/projects",
  "/about",
  "/contact",
  "/accessibility",
  "/privacy",
  "/llms.txt",
  "/llms-full.txt",
  "/guides",
] as const;

function parseLastMod(value: string | null | undefined): Date {
  if (!value) return new Date();
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? new Date() : new Date(parsed);
}

function maxDate(dates: Date[]): Date {
  if (!dates.length) return new Date();
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getCatalog();

  const liveProducts =
    products.length > 0
      ? products.map((product) => ({
          slug: product.slug,
          updatedAt: product.updatedAt ?? null,
          category: product.category,
        }))
      : sitemapProductEntries.map((entry) => ({ slug: entry.slug, updatedAt: entry.updatedAt, category: null as null }));

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => {
    const related = liveProducts.filter((item) => item.category === category.slug || item.category === null);
    const lastModified = maxDate(related.map((item) => parseLastMod(item.updatedAt)));
    return {
      url: `${SITE.url}/catalog/${category.slug}`,
      lastModified,
    };
  });

  const productEntries: MetadataRoute.Sitemap = liveProducts.map((product) => ({
    url: `${SITE.url}/product/${product.slug}`,
    lastModified: parseLastMod(product.updatedAt),
  }));

  const guideEntries: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${SITE.url}/guides/${guide.slug}`,
    lastModified: new Date(guide.datePublished),
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries, ...guideEntries];
}
