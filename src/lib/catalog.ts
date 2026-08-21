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

const SUBCATEGORY_PRIORITY = [
  "עומד",
  "שוכב",
  "משולב",
  "עוגות",
  "דלתות הזזה מנוע פנימי",
  "דלתות הזזה מנוע חיצוני",
  "דלתות פתיחה מנוע פנימי",
  "דלתות פתיחה מנוע חיצוני",
  "פתוח מנוע פנימי",
  "פתוח מנוע חיצוני",
  "מנוע פנימי",
  "מנוע חיצוני",
];

function compareSubcategoryNames(aName: string | null | undefined, bName: string | null | undefined) {
  const a = aName?.trim() ?? "";
  const b = bName?.trim() ?? "";
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  const aRank = SUBCATEGORY_PRIORITY.indexOf(a);
  const bRank = SUBCATEGORY_PRIORITY.indexOf(b);
  const aOrder = aRank === -1 ? SUBCATEGORY_PRIORITY.length : aRank;
  const bOrder = bRank === -1 ? SUBCATEGORY_PRIORITY.length : bRank;
  if (aOrder !== bOrder) return aOrder - bOrder;
  return a.localeCompare(b, "he");
}

type CategoryRow = {
  id: string;
  name: string;
  parent_id: string | null;
  image_url: string | null;
  description: string | null;
};

type SpecSource = {
  volume: number | string | null;
  brand: string | null;
  model: string | null;
  sku: string | null;
  specifications: Record<string, unknown> | null;
};

type LinkedProduct = SpecSource & {
  id: string;
  description: string | null;
  subcategory_id: string | null;
  image_url: string | null;
  updated_at: string | null;
};

type ListingImageRow = {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number | null;
  kind: string | null;
  status: string | null;
};

type VariantSource = {
  id?: string;
  code: string | null;
  width: number | string | null;
  depth: number | string | null;
  height: number | string | null;
  volume: number | string | null;
  supplier_model_name?: string | null;
};

type ListingVariantRow = {
  sort_order: number | null;
  product_variants: VariantSource | VariantSource[] | null;
};

type ListingProductRow = {
  sort_order: number | null;
  products: LinkedProduct | LinkedProduct[] | null;
};

type ListingRow = {
  id: string;
  title: string;
  description: string | null;
  primary_image_url: string | null;
  drawing_url: string | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
  category_id: string | null;
  catalog_listing_images: ListingImageRow[] | null;
  catalog_listing_variants: ListingVariantRow[] | null;
  catalog_listing_products: ListingProductRow[] | null;
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

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function resolveParent(categoryById: Map<string, CategoryRow>, categoryId: string | null) {
  if (!categoryId) return undefined;
  const current = categoryById.get(categoryId);
  if (!current || EXCLUDED_PARENTS.has(current.name)) return undefined;
  if (current.parent_id) {
    const parent = categoryById.get(current.parent_id);
    if (!parent || EXCLUDED_PARENTS.has(parent.name)) return undefined;
    if (PARENT_SLUGS[parent.name]) return parent;
  }
  if (PARENT_SLUGS[current.name]) return current;
  return undefined;
}

function buildSpecs(
  product: SpecSource,
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

function mapVariant(row: VariantSource): SizeVariant {
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
    modelName: row.supplier_model_name ?? null,
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

function laterTimestamp(a: string | null | undefined, b: string | null | undefined) {
  const aTime = a ? Date.parse(a) : 0;
  const bTime = b ? Date.parse(b) : 0;
  if (!aTime && !bTime) return null;
  return (aTime >= bTime ? a : b) ?? null;
}

function bustImageUrl(src: string | null | undefined, version: string | null | undefined) {
  if (!src) return null;
  if (!version) return src;
  const stamp = Date.parse(version);
  const token = Number.isNaN(stamp) ? encodeURIComponent(version) : String(stamp);
  return `${src}${src.includes("?") ? "&" : "?"}v=${token}`;
}

function mapListingImages(
  title: string,
  primary: string | null,
  extra: ListingImageRow[],
  version: string | null,
): Product["images"] {
  const seen = new Set<string>();
  const images: Product["images"] = [];

  const add = (src: string | null, alt: string) => {
    const next = bustImageUrl(src, version);
    if (!next || seen.has(next)) return;
    seen.add(next);
    images.push({ src: next, alt, fit: "contain" });
  };

  add(primary, title);
  extra
    .filter((image) => image.kind === "gallery" && image.status === "active")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .forEach((image) => add(image.image_url, image.alt_text || title));

  return images;
}

function mapListingVariants(rows: ListingVariantRow[]): SizeVariant[] {
  return rows
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((row) => one(row.product_variants))
    .filter((variant): variant is VariantSource => Boolean(variant))
    .map(mapVariant);
}

function firstLinkedProduct(rows: ListingProductRow[]): LinkedProduct | null {
  return (
    rows
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((row) => one(row.products))
      .find((product): product is LinkedProduct => Boolean(product)) ?? null
  );
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

    const [categoryRes, listingRes] = await Promise.all([
      supabase.from("categories").select("id, name, parent_id, image_url, description"),
      supabase
        .from("catalog_listings")
        .select(
          `
          id, title, description, primary_image_url, drawing_url, sort_order, created_at, updated_at, category_id,
          catalog_listing_images ( id, image_url, alt_text, sort_order, kind, status ),
          catalog_listing_variants (
            sort_order,
            product_variants ( id, code, width, depth, height, volume, supplier_model_name )
          ),
          catalog_listing_products (
            sort_order,
            products ( id, description, brand, model, sku, volume, specifications, subcategory_id, image_url, updated_at )
          )
        `,
        )
        .eq("show_on_website", true)
        .eq("status", "active")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    if (categoryRes.error) throw categoryRes.error;
    if (listingRes.error) throw listingRes.error;

    const categoryRows = (categoryRes.data ?? []) as CategoryRow[];
    const categoryById = new Map(categoryRows.map((row) => [row.id, row]));

    const subSlugUsed = new Map<string, Set<string>>();
    const subSlugById = new Map<string, string>();
    const products: Product[] = [];

    for (const row of (listingRes.data ?? []) as ListingRow[]) {
      const parent = resolveParent(categoryById, row.category_id);
      if (!parent) continue;

      const categorySlug = PARENT_SLUGS[parent.name];
      if (!categorySlug) continue;

      const siteCategory = getCategory(categorySlug);
      const linked = firstLinkedProduct(row.catalog_listing_products ?? []);
      const description = row.description?.trim() || linked?.description?.trim() || null;
      const subcategory = linked?.subcategory_id ? categoryById.get(linked.subcategory_id) : undefined;
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

      const variants = mapListingVariants(row.catalog_listing_variants ?? []);
      const features = parseFeatures(description);
      const specs = buildSpecs(
        {
          volume: linked?.volume ?? null,
          brand: linked?.brand ?? null,
          model: linked?.model ?? null,
          sku: linked?.sku ?? null,
          specifications: linked?.specifications ?? null,
        },
        features,
        variants,
      );
      const imageVersion = laterTimestamp(row.updated_at, linked?.updated_at);
      const images = mapListingImages(
        row.title,
        linked?.image_url || row.primary_image_url || null,
        row.catalog_listing_images ?? [],
        imageVersion,
      );

      products.push({
        id: row.id,
        slug: row.id,
        name: row.title,
        category: categorySlug,
        categoryName: siteCategory?.name ?? parent.name,
        subcategorySlug,
        subcategoryName: subcategory?.name ?? null,
        note: productNote(subcategory?.name ?? null, variants),
        eyebrow: [siteCategory?.name ?? parent.name, subcategory?.name].filter(Boolean).join(" · "),
        description: isChecklist(description)
          ? `${row.title}${subcategory ? ` - ${subcategory.name}` : ""}.`
          : description || `${row.title}.`,
        images,
        drawingUrl: row.drawing_url,
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
      const productImage = products
        .filter((item) => item.category === category.slug && item.images[0])
        .sort((a, b) => compareSubcategoryNames(a.subcategoryName, b.subcategoryName))[0]?.images[0];

      if (productImage) {
        const image = { src: productImage.src, alt: category.name, fit: "contain" as const };
        return { ...category, image, catalogImage: image };
      }

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
        return [slug, [...counts.values()].sort((a, b) => compareSubcategoryNames(a.name, b.name))];
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
  return catalog.products
    .filter((product) => product.category === slug)
    .sort((a, b) => compareSubcategoryNames(a.subcategoryName, b.subcategoryName));
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

const FEATURED_TITLES = [
  "חלבייה דלתות הזזה - BFG",
  "חלבייה פתוחה דופן זכוכית - ELF",
  "מעדנייה זכוכית ישרה מנוע פנימי - ARAMA",
  "מקרר עומד - 3 דלתות (שחור)",
  "מקרר עומד - 4 דלתות (לבן)",
  "מקפיא משולב (קומבי) - ARV",
  "מקפיא שוכב - ECH",
];

export async function getFeaturedProducts() {
  const catalog = await getCatalog();
  const byName = new Map(catalog.products.map((product) => [product.name, product]));
  const picks = FEATURED_TITLES.map((name) => byName.get(name)).filter(
    (product): product is Product => Boolean(product?.images[0]),
  );
  if (picks.length) return picks;

  const withImages = catalog.products.filter((product) => product.images[0]);
  return withImages.slice(0, 7);
}

export async function getSelectedProducts() {
  const catalog = await getCatalog();
  const withImages = catalog.products.filter((product) => product.images[0]);
  const order: CategorySlug[] = ["dairy", "refrigerators", "deli", "freezers"];
  const picks: Product[] = [];

  for (const slug of order) {
    const match = withImages.find((item) => item.category === slug);
    if (match) picks.push(match);
  }

  for (const slug of order) {
    const match = withImages.find(
      (item) => item.category === slug && !picks.some((picked) => picked.id === item.id),
    );
    if (match) picks.push(match);
  }

  return (picks.length > 0 ? picks : withImages).slice(0, 8);
}

export function getCategoryName(slug: CategorySlug, list: Category[] = categories) {
  return list.find((category) => category.slug === slug)?.name ?? slug;
}
