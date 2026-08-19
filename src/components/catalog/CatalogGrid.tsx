import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";

type CatalogGridProps = {
  products: Product[];
  categories: Category[];
};

function pickFamilyProducts(products: Product[], slug: Category["slug"], limit = 4) {
  const inCategory = products.filter((product) => product.category === slug);
  const withImages = inCategory.filter((product) => product.images[0]);
  const pool = withImages.length >= Math.min(limit, inCategory.length) ? withImages : inCategory;
  const picked: Product[] = [];
  const seenSubs = new Set<string>();

  for (const product of pool) {
    const key = product.subcategorySlug ?? product.id;
    if (seenSubs.has(key)) continue;
    seenSubs.add(key);
    picked.push(product);
    if (picked.length >= limit) return picked;
  }

  for (const product of pool) {
    if (picked.includes(product)) continue;
    picked.push(product);
    if (picked.length >= limit) break;
  }

  return picked;
}

export function CatalogGrid({ products, categories }: CatalogGridProps) {
  const families = categories
    .map((category, index) => {
      const total = products.filter((product) => product.category === category.slug).length;
      return {
        category,
        index,
        total,
        items: pickFamilyProducts(products, category.slug),
      };
    })
    .filter((family) => family.items.length > 0);

  if (!families.length) return null;

  return (
    <section className="catalog-families">
      <div className="catalog-families-intro">
        <h2>מבחר דגמים</h2>
        <p>לא כל הקטלוג בשורה אחת. בכל משפחה כמה תצורות שמראות את הכיוון - משם נכנסים לכל הדגמים.</p>
      </div>

      {families.map(({ category, index, total, items }) => (
        <article key={category.slug} className="catalog-family">
          <header className="catalog-family-head">
            <div>
              <div className="catalog-family-kicker">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {total} דגמים
              </div>
              <h3>{category.name}</h3>
              <p>{category.short}</p>
            </div>
            <Link href={`/catalog/${category.slug}`} className="link-underline">
              לכל {category.name} ←
            </Link>
          </header>

          <div className="catalog-family-grid">
            {items.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                showCategory={false}
                note={product.note}
                imageFit="contain"
              />
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
