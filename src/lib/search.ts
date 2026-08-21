import type { Product } from "./types";

export type SearchItem = {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  subcategoryName: string | null;
  imageSrc?: string;
};

export function toSearchItems(products: Product[]): SearchItem[] {
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    categoryName: product.categoryName,
    subcategoryName: product.subcategoryName,
    imageSrc: product.images[0]?.src,
  }));
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/["'״׳]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function searchProducts(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const q = normalize(query);
  if (q.length < 1) return [];

  return items
    .map((item) => {
      const name = normalize(item.name);
      const category = normalize(item.categoryName);
      const subcategory = normalize(item.subcategoryName ?? "");
      let score = 0;

      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 86;
      else if (name.includes(q)) score = 70;
      else if (category.startsWith(q) || subcategory.startsWith(q)) score = 48;
      else if (category.includes(q) || subcategory.includes(q)) score = 32;

      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name, "he"))
    .slice(0, limit)
    .map((row) => row.item);
}
