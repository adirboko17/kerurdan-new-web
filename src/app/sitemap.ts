import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const revalidate = 120;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products } = await getCatalog();
  const staticRoutes = ["", "/catalog", "/solutions", "/projects", "/about", "/contact", "/accessibility", "/privacy"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE.url}${path}`,
      lastModified: new Date(),
    })),
    ...categories.map((category) => ({
      url: `${SITE.url}/catalog/${category.slug}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `${SITE.url}/product/${product.slug}`,
      lastModified: new Date(),
    })),
  ];
}
