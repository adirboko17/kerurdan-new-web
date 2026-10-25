import type { Product } from "./types";
import { SITE } from "./site";

function specValue(product: Product, label: string) {
  return product.specs.find((row) => row.label === label)?.value?.trim();
}

function sentenceParts(product: Product) {
  const parts: string[] = [];
  const brand = specValue(product, "מותג");
  const model = specValue(product, "דגם");
  if (brand || model) {
    parts.push([brand, model].filter(Boolean).join(" "));
  }
  if (product.subcategoryName) {
    parts.push(product.subcategoryName);
  }
  parts.push(product.categoryName);
  return parts.filter(Boolean);
}

export function productSeoTitle(product: Product): string {
  const tail = sentenceParts(product).join(" · ");
  return tail ? `${product.name} – ${tail} | ${SITE.name}` : `${product.name} | ${SITE.name}`;
}

export function productSeoDescription(product: Product): string {
  const bits: string[] = [product.name];
  if (product.subcategoryName) bits.push(product.subcategoryName);
  bits.push(product.categoryName);
  const specHints = product.specs
    .filter((row) => ["טווח טמפרטורה", "מידות", "מידות זמינות", "נפח", "יחידת קירור"].includes(row.label))
    .slice(0, 2)
    .map((row) => `${row.label}: ${row.value}`);
  const core = bits.join(" · ");
  const extras = specHints.length ? ` ${specHints.join(". ")}.` : "";
  return `${core} – ${SITE.name}, ייבוא ושיווק ציוד קירור מסחרי.${extras}`.slice(0, 320);
}

export function productSeoParagraph(product: Product): string {
  const sentences: string[] = [];

  const intro = [product.name, product.subcategoryName, product.categoryName].filter(Boolean).join(" – ");
  if (intro) {
    sentences.push(`${intro}.`);
  }

  const dims =
    product.sizeVariants.length === 1
      ? product.sizeVariants[0].dims !== "-"
        ? `מידות לפי הקטלוג: ${product.sizeVariants[0].dims} ס״מ.`
        : null
      : product.sizeVariants.length > 1
        ? `הדגם זמין ב־${product.sizeVariants.length} תצורות מידה.`
        : null;
  if (dims) sentences.push(dims);

  const temp = specValue(product, "טווח טמפרטורה");
  const cooling = specValue(product, "יחידת קירור");
  const volume = specValue(product, "נפח");
  const detail = [temp && `טווח טמפרטורה ${temp}`, cooling && `יחידת קירור ${cooling}`, volume && `נפח ${volume}`]
    .filter(Boolean)
    .join(", ");
  if (detail) {
    sentences.push(`${detail}.`);
  } else if (product.features.length) {
    const feature = product.features[0].replace(/^[✅✓]\s*/, "").trim();
    if (feature) sentences.push(`${feature}.`);
  }

  if (product.suitable.length) {
    sentences.push(`מתאים ל${product.suitable.slice(0, 3).join(", ")}.`);
  }

  return sentences.slice(0, 3).join(" ");
}

export function productImageAlt(product: Product, index: number, fallback?: string | null): string {
  if (fallback?.trim() && fallback.trim() !== product.name) {
    return fallback.trim();
  }
  const kind = index === 0 ? "תמונת מוצר" : `תמונה ${index + 1}`;
  const context = [product.name, product.subcategoryName, product.categoryName].filter(Boolean).join(" – ");
  return `${kind}: ${context}`;
}

export function withProductImageAlts(product: Product): Product {
  return {
    ...product,
    images: product.images.map((image, index) => ({
      ...image,
      alt: productImageAlt(product, index, image.alt),
    })),
  };
}
