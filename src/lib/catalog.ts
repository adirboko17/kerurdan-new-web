import { cache } from "react";
import { categories, getCategory } from "./data";
import { createSupabaseServerClient } from "./supabase/server";
import type {
  Category,
  CategorySlug,
  Product,
  SizeVariant,
  SpecRow,
  SubcategoryFilter,
} from "./types";

const EXCLUDED_PARENTS = new Set(["סלטיות"]);

const PARENT_SLUGS: Record<string, CategorySlug> = {
  חלביות: "dairy",
  מעדניות: "deli",
  מקררים: "refrigerators",
  מקפיאים: "freezers",
};

type CategoryRow = {
  id: string;
  name: string;
  parent_id: string | null;
  image_url: string | null;
  description: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  brand: string | null;
  model: string | null;
  image_url: string | null;
  volume: number | string | null;
  sort_order: number | null;
  specifications: Record<string, unknown> | null;
  category_id: string | null;
  subcategory_id: string | null;
};

type ImageRow = {
  product_id: string | null;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
  status: string | null;
};

type VariantRow = {
  product_id: string;
  code: string | null;
  width: number | string | null;
  depth: number | string | null;
  height: number | string | null;
  volume: number | string | null;
  supplier_model_name: string | null;
};

export type CatalogData = {
  categories: Category[];
  products: Product[];
  subcategories: Record<CategorySlug, SubcategoryFilter[]>;
};

function slugify(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/["'`]/g, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\u0590-\u05FFa-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function formatNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return String(value);
  return Number.isInteger(numeric) ? String(numeric) : String(numeric);
}

function uniqueSlug(name: string, used: Set<string>, fallback: string) {
  const base = slugify(name) || fallback.slice(0, 8);
  let slug = base;
  let index = 2;
  while (used.has(slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }
  used.add(slug);
  return slug;
}

function parseFeatures(description: string | null) {
  if (!description?.trim()) return [];
  return description
    .split(/\r?\n/)
    .map((line) => line.replace(/^[✅✓]\s*/, "").trim())
    .filter(Boolean);
}

function isChecklist(description: string | null) {
  return Boolean(description && /^\s*[✅✓]/.test(description));
}

function takeFeature(features: string[], pattern: RegExp) {
  for (const feature of features) {
    const match = feature.match(pattern);
    if (match) return match[1]?.trim() || feature;
  }
  return null;
}

function hasFeature(features: string[], pattern: RegExp) {
  return features.some((feature) => pattern.test(feature));
}

function buildSpecs(
  product: ProductRow,
  features: string[],
  variants: SizeVariant[],
): SpecRow[] {
  const rows: SpecRow[] = [];
  const specs = product.specifications ?? {};

  const fromJson = (label: string, keys: string[], mono = false) => {
    for (const key of keys) {
      const value = specs[key];
      if (value !== undefined && value !== null && String(value).trim()) {
        rows.push({ label, value: String(value), mono });
        return;
      }
    }
  };

  const temperature =
    takeFeature(features, /טווח טמפרטורה\s*(.+)/) ??
    takeFeature(features, /(\+?-?\d+\s*\/\s*\+?-?\d+)/);
  if (temperature) rows.push({ label: "טווח טמפרטורה", value: temperature, mono: true, accent: true });
  fromJson("טווח טמפרטורה", ["temperature", "temp", "טווח טמפרטורה"], true);

  if (variants.length === 1) {
    rows.push({ label: "מידות", value: `${variants[0].dims} ס״מ`, mono: true });
  } else if (variants.length > 1) {
    rows.push({
      label: "מידות זמינות",
      value: `${variants.length} תצורות`,
      mono: true,
    });
  }

  if (hasFeature(features, /יחידת קירור פנימית/)) {
    rows.push({ label: "יחידת קירור", value: "פנימית" });
  } else if (hasFeature(features, /יחידת קירור חיצונית/)) {
    rows.push({ label: "יחידת קירור", value: "חיצונית" });
  }

  if (hasFeature(features, /אוויר מאולץ/)) rows.push({ label: "סוג קירור", value: "אוויר מאולץ" });
  if (hasFeature(features, /הפשרה אוטומטית/)) rows.push({ label: "הפשרה", value: "אוטומטית" });

  const lighting = takeFeature(features, /(תאורת לד.*)/);
  if (lighting) rows.push({ label: "תאורה", value: lighting.replace(/^תאורת\s*/, "תאורת ") });

  const shelves =
    takeFeature(features, /(\d+\s*קומות.*)/) ??
    takeFeature(features, /מגיע\s*(.+מדפים.*)/) ??
    takeFeature(features, /(\d+\s*מדפים)/);
  if (shelves) rows.push({ label: "מדפים", value: shelves });

  const color = takeFeature(features, /צבע\s+(.+)/);
  if (color) rows.push({ label: "גימור", value: color });

  if (hasFeature(features, /גלגלים/)) rows.push({ label: "ניידות", value: "גלגלים עם מעצור" });
  if (hasFeature(features, /דפנות/)) {
    const sides = takeFeature(features, /(דפנות.+)/);
    if (sides) rows.push({ label: "דפנות", value: sides.replace(/^דפנות\s*/, "") });
  }
  if (hasFeature(features, /בקר אלקטרוני/)) rows.push({ label: "בקר", value: "אלקטרוני" });
  if (hasFeature(features, /שירות עצמי/)) rows.push({ label: "שימוש", value: "שירות עצמי" });
  if (hasFeature(features, /וילון כיסוי לילה/)) rows.push({ label: "כיסוי", value: "וילון לילה" });

  const volume = formatNumber(product.volume);
  if (volume) rows.push({ label: "נפח", value: `${volume} ל׳`, mono: true });
  if (product.brand) rows.push({ label: "מותג", value: product.brand });
  if (product.model) rows.push({ label: "דגם", value: product.model, mono: true });
  if (product.sku) rows.push({ label: "מק״ט", value: product.sku, mono: true });

  fromJson("מותג", ["brand", "מותג"]);
  fromJson("דגם", ["model", "דגם"], true);

  const seen = new Set<string>();
  return rows.filter((row) => {
    if (seen.has(row.label) || row.value === "-") return false;
    seen.add(row.label);
    return true;
  });
}

function buildHighlights(specs: SpecRow[], variants: SizeVariant[], features: string[]): SpecRow[] {
  const temperature = specs.find((row) => row.label === "טווח טמפרטורה");
  const shelves = specs.find((row) => row.label === "מדפים");
  const finish = specs.find((row) => row.label === "גימור");
  const first = variants[0];

  const highlights: SpecRow[] = [];
  if (first) {
    highlights.push({
      label: variants.length > 1 ? "מידה לדוגמה" : "מידות בס״מ",
      value: first.dims,
      mono: true,
    });
  }
  if (temperature) highlights.push({ ...temperature, accent: true });
  if (shelves) {
    const count = shelves.value.match(/\d+/)?.[0] ?? shelves.value;
    highlights.push({ label: "מדפים", value: count, mono: true });
  }
  else if (variants.length > 1) {
    highlights.push({ label: "תצורות", value: String(variants.length), mono: true });
  } else if (finish) {
    highlights.push(finish);
  } else if (hasFeature(features, /שירות עצמי/)) {
    highlights.push({ label: "שימוש", value: "שירות עצמי" });
  }

  return highlights.slice(0, 4);
}

function mapVariant(row: VariantRow): SizeVariant {
  const width = formatNumber(row.width);
  const depth = formatNumber(row.depth);
  const height = formatNumber(row.height);
  const dims = [width, depth, height].filter(Boolean).join("×") || "-";

  return {
    code: row.code,
    width,
    depth,
    height,
    volume: formatNumber(row.volume),
    modelName: row.supplier_model_name,
    dims,
  };
}

function productNote(subcategoryName: string | null, variants: SizeVariant[]) {
  const parts: string[] = [];
  if (subcategoryName) parts.push(subcategoryName);
  if (variants.length > 1) parts.push(`${variants.length} מידות`);
  else if (variants[0] && variants[0].dims !== "-") parts.push(`${variants[0].dims} ס״מ`);
  return parts.join(" · ");
}

function mapImages(
  product: ProductRow,
  extra: ImageRow[],
): Product["images"] {
  const seen = new Set<string>();
  const images: Product["images"] = [];

  const add = (src: string | null, alt: string, fit: Product["images"][number]["fit"] = "contain") => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    images.push({ src, alt, fit });
  };

  add(product.image_url, product.name);
  extra
    .filter((image) => !image.status || image.status === "active")
    .sort((a, b) => {
      if (a.is_primary === b.is_primary) return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      return a.is_primary ? -1 : 1;
    })
    .forEach((image) => add(image.image_url, image.alt_text || product.name));

  return images;
}

export const getCatalog = cache(async (): Promise<CatalogData> => {
  const empty: CatalogData = {
    categories,
    products: [],
    subcategories: {
      dairy: [],
      deli: [],
      refrigerators: [],
      freezers: [],
    },
  };

  try {
    const supabase = createSupabaseServerClient();

    const [categoryRes, productRes, imageRes, variantRes] = await Promise.all([
      supabase.from("categories").select("id, name, parent_id, image_url, description"),
      supabase
        .from("products")
        .select(
          "id, name, sku, description, brand, model, image_url, volume, sort_order, specifications, category_id, subcategory_id, show_in_catalog, status",
        )
        .eq("show_in_catalog", true),
      supabase
        .from("product_images")
        .select("product_id, image_url, alt_text, is_primary, sort_order, status"),
      supabase
        .from("product_variants")
        .select("product_id, code, width, depth, height, volume, supplier_model_name"),
    ]);

    if (categoryRes.error) throw categoryRes.error;
    if (productRes.error) throw productRes.error;
    if (imageRes.error) throw imageRes.error;
    if (variantRes.error) throw variantRes.error;

    const categoryRows = (categoryRes.data ?? []) as CategoryRow[];
    const categoryById = new Map(categoryRows.map((row) => [row.id, row]));
    const excludedIds = new Set(
      categoryRows.filter((row) => EXCLUDED_PARENTS.has(row.name)).map((row) => row.id),
    );
    categoryRows.forEach((row) => {
      if (row.parent_id && excludedIds.has(row.parent_id)) excludedIds.add(row.id);
    });

    const imagesByProduct = new Map<string, ImageRow[]>();
    for (const image of (imageRes.data ?? []) as ImageRow[]) {
      if (!image.product_id) continue;
      const list = imagesByProduct.get(image.product_id) ?? [];
      list.push(image);
      imagesByProduct.set(image.product_id, list);
    }

    const variantsByProduct = new Map<string, SizeVariant[]>();
    for (const variant of (variantRes.data ?? []) as VariantRow[]) {
      const list = variantsByProduct.get(variant.product_id) ?? [];
      list.push(mapVariant(variant));
      variantsByProduct.set(variant.product_id, list);
    }

    const subSlugUsed = new Map<string, Set<string>>();
    const subSlugById = new Map<string, string>();
    const products: Product[] = [];

    const productRows = ((productRes.data ?? []) as ProductRow[]).slice().sort((a, b) => {
      const order = (a.sort_order ?? 999) - (b.sort_order ?? 999);
      return order !== 0 ? order : a.name.localeCompare(b.name, "he");
    });

    for (const row of productRows) {
      const parent = row.category_id ? categoryById.get(row.category_id) : undefined;
      if (!parent || excludedIds.has(parent.id)) continue;

      const categorySlug = PARENT_SLUGS[parent.name];
      if (!categorySlug) continue;

      const siteCategory = getCategory(categorySlug);
      const subcategory = row.subcategory_id ? categoryById.get(row.subcategory_id) : undefined;
      let subcategorySlug: string | null = null;
      if (subcategory) {
        const existing = subSlugById.get(subcategory.id);
        if (existing) {
          subcategorySlug = existing;
        } else {
          const subSlugs = subSlugUsed.get(categorySlug) ?? new Set<string>();
          subcategorySlug = uniqueSlug(subcategory.name, subSlugs, subcategory.id);
          subSlugUsed.set(categorySlug, subSlugs);
          subSlugById.set(subcategory.id, subcategorySlug);
        }
      }

      const variants = variantsByProduct.get(row.id) ?? [];
      const features = parseFeatures(row.description);
      const specs = buildSpecs(row, features, variants);
      const images = mapImages(row, imagesByProduct.get(row.id) ?? []);

      products.push({
        id: row.id,
        slug: row.id,
        name: row.name,
        category: categorySlug,
        categoryName: siteCategory?.name ?? parent.name,
        subcategorySlug,
        subcategoryName: subcategory?.name ?? null,
        note: productNote(subcategory?.name ?? null, variants),
        eyebrow: [siteCategory?.name ?? parent.name, subcategory?.name].filter(Boolean).join(" · "),
        description: isChecklist(row.description)
          ? `${row.name}${subcategory ? ` - ${subcategory.name}` : ""}.`
          : row.description?.trim() || `${row.name}.`,
        images,
        highlights: buildHighlights(specs, variants, features),
        specs,
        sizeVariants: variants,
        suitable: siteCategory?.suitable ?? [],
        related: [],
        features,
      });
    }

    for (const product of products) {
      product.related = products
        .filter((item) => item.id !== product.id && item.category === product.category)
        .sort((a, b) => {
          const aSame = a.subcategorySlug === product.subcategorySlug ? 0 : 1;
          const bSame = b.subcategorySlug === product.subcategorySlug ? 0 : 1;
          return aSame - bSame;
        })
        .slice(0, 3)
        .map((item) => item.slug);
    }

    const liveCategories = categories.map((category) => {
      const parent = categoryRows.find((row) => PARENT_SLUGS[row.name] === category.slug && !row.parent_id);
      if (!parent?.image_url) return category;
      const image = { src: parent.image_url, alt: category.name, fit: "contain" as const };
      return {
        ...category,
        image: category.image ?? image,
        catalogImage: image,
      };
    });

    const subcategories = Object.fromEntries(
      (["dairy", "deli", "refrigerators", "freezers"] as CategorySlug[]).map((slug) => {
        const counts = new Map<string, SubcategoryFilter>();
        for (const product of products.filter((item) => item.category === slug && item.subcategorySlug && item.subcategoryName)) {
          const current = counts.get(product.subcategorySlug!) ?? {
            slug: product.subcategorySlug!,
            name: product.subcategoryName!,
            count: 0,
          };
          current.count += 1;
          counts.set(product.subcategorySlug!, current);
        }
        return [slug, [...counts.values()]];
      }),
    ) as CatalogData["subcategories"];

    return {
      categories: liveCategories,
      products,
      subcategories,
    };
  } catch (error) {
    console.error("Failed to load catalog from Supabase", error);
    return empty;
  }
});

export async function getCatalogCategories() {
  const catalog = await getCatalog();
  return catalog.categories;
}

export async function getCatalogProducts() {
  const catalog = await getCatalog();
  return catalog.products;
}

export async function getCatalogCategory(slug: string) {
  const catalog = await getCatalog();
  return catalog.categories.find((category) => category.slug === slug);
}

function normalizeParam(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function getCatalogProduct(slug: string) {
  const catalog = await getCatalog();
  const key = normalizeParam(slug);
  return catalog.products.find(
    (product) => product.slug === key || product.id === key || product.slug === slug || product.id === slug,
  );
}

export async function getProductsByCategory(slug: CategorySlug) {
  const catalog = await getCatalog();
  return catalog.products.filter((product) => product.category === slug);
}

export async function getComplementaryProducts(product: Product) {
  const catalog = await getCatalog();
  const available = catalog.products.filter((item) => item.id !== product.id && item.images[0]);
  const order: CategorySlug[] = ["dairy", "deli", "refrigerators", "freezers"];
  const picks: Product[] = [];

  for (const slug of order.filter((item) => item !== product.category)) {
    const match = available.find((item) => item.category === slug);
    if (match) picks.push(match);
  }

  for (const slug of [product.category, ...order]) {
    if (picks.length >= 4) break;
    const match = available.find(
      (item) => item.category === slug && !picks.some((picked) => picked.id === item.id),
    );
    if (match) picks.push(match);
  }

  for (const item of available) {
    if (picks.length >= 4) break;
    if (!picks.some((picked) => picked.id === item.id)) picks.push(item);
  }

  return picks.slice(0, 4);
}

export async function getFeaturedProduct() {
  const catalog = await getCatalog();
  return (
    catalog.products.find((product) => product.category === "refrigerators" && product.name.includes("4 דלתות")) ??
    catalog.products.find((product) => product.category === "refrigerators") ??
    catalog.products[0] ??
    null
  );
}

export async function getFeaturedProducts() {
  const catalog = await getCatalog();
  const withImages = catalog.products.filter((product) => product.images[0]);
  const picks: Product[] = [];

  for (const slug of ["refrigerators", "dairy", "deli", "freezers"] as CategorySlug[]) {
    for (const product of withImages.filter((item) => item.category === slug).slice(0, 2)) {
      picks.push(product);
    }
  }

  return picks.length > 0 ? picks : withImages.slice(0, 6);
}

export async function getSelectedProducts() {
  const catalog = await getCatalog();
  const withImages = catalog.products.filter((product) => product.images[0]);
  const picks: Product[] = [];
  for (const slug of ["dairy", "refrigerators", "deli", "freezers"] as CategorySlug[]) {
    for (const product of withImages.filter((item) => item.category === slug).slice(0, 2)) {
      picks.push(product);
    }
  }
  return (picks.length > 0 ? picks : withImages).slice(0, 8);
}

export function getCategoryName(slug: CategorySlug, list: Category[] = categories) {
  return list.find((category) => category.slug === slug)?.name ?? slug;
}
