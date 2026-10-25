import Link from "next/link";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SiteImage } from "@/components/ui/SiteImage";
import { getCatalog } from "@/lib/catalog";
import { extractProductSlugsFromBody, getGuideCategorySlugs } from "@/lib/guide-content";
import { categories } from "@/lib/data";
import type { Product } from "@/lib/types";

type GuideRelatedCatalogProps = {
  slug: string;
  bodyMarkdown: string;
};

function pickRelatedProducts(allProducts: Product[], slugIds: string[], categorySlugs: string[]): Product[] {
  const bySlug = new Map(allProducts.map((product) => [product.slug.toLowerCase(), product]));
  const picked: Product[] = [];
  const seen = new Set<string>();

  for (const id of slugIds) {
    const product = bySlug.get(id);
    if (!product || seen.has(product.slug)) continue;
    if (!product.images[0]) continue;
    seen.add(product.slug);
    picked.push(product);
    if (picked.length >= 4) return picked;
  }

  for (const categorySlug of categorySlugs) {
    for (const product of allProducts) {
      if (product.category !== categorySlug || seen.has(product.slug)) continue;
      if (!product.images[0]) continue;
      seen.add(product.slug);
      picked.push(product);
      if (picked.length >= 4) return picked;
    }
  }

  return picked;
}

export async function GuideRelatedCatalog({ slug, bodyMarkdown }: GuideRelatedCatalogProps) {
  const categorySlugs = getGuideCategorySlugs(slug);
  if (!categorySlugs.length) return null;

  const catalog = await getCatalog();
  const productSlugs = extractProductSlugsFromBody(bodyMarkdown);
  const products = pickRelatedProducts(catalog.products, productSlugs, categorySlugs);
  const relatedCategories = categories.filter((category) => categorySlugs.includes(category.slug));

  if (!products.length && !relatedCategories.length) return null;

  return (
    <section className="guide-related-catalog section-pad">
      <div className="guide-related-catalog-inner">
        <div className="guide-section-head">
          <h2>מהקטלוג</h2>
          <p>דגמים וקטגוריות שמוזכרים במדריך – לפרטים, מידות והצעת מחיר.</p>
        </div>

        {relatedCategories.length ? (
          <div className="guide-category-row">
            {relatedCategories.map((category) => (
              <Link key={category.slug} href={`/catalog/${category.slug}`} className="guide-category-card">
                <div className="guide-category-media">
                  {category.catalogImage || category.image ? (
                    <SiteImage
                      src={(category.catalogImage ?? category.image)!.src}
                      alt={category.name}
                      fit="contain"
                      padding="10%"
                    />
                  ) : (
                    <ImageSlot placeholder={category.placeholder ?? category.name} />
                  )}
                </div>
                <div className="guide-category-copy">
                  <span className="guide-category-name">{category.name}</span>
                  <span className="guide-category-short">{category.short}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {products.length ? (
          <ProductCarousel products={products} showCategory className="guide-product-carousel" imageFit="contain" />
        ) : null}
      </div>
    </section>
  );
}
