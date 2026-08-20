import type { Metadata } from "next";
import Link from "next/link";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SiteImage } from "@/components/ui/SiteImage";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "קטלוג",
  description: "ציוד קירור מסחרי ותעשייתי שנבחר להתאים לעבודה אמיתית. חלביות, מעדניות, מקררים ומקפיאים - בכמה תצורות, נפחים ומידות.",
};

export default async function CatalogPage() {
  const { categories, products } = await getCatalog();

  return (
    <PageShell active="catalog">
      <section className="page-hero is-bordered">
        <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "קטלוג" }]} />
        <div className="page-hero-grid">
          <h1>פתרונות הקירור שלנו</h1>
          <p>ציוד קירור מסחרי ותעשייתי שנבחר להתאים לעבודה אמיתית. חלביות, מעדניות, מקררים ומקפיאים - בכמה תצורות, נפחים ומידות.</p>
        </div>
      </section>

      <section className="catalog-panels">
        <div className="catalog-grid">
          {categories.map((category) => {
            const image = category.catalogImage ?? category.image;
            return (
              <Link key={category.slug} href={`/catalog/${category.slug}`} className="panel">
                <div className={`panel-media${image ? "" : " panel-dark"}`}>
                  {image ? (
                    <SiteImage
                      src={image.src}
                      alt={category.name}
                      fit="contain"
                      padding="12%"
                      sizes="(max-width: 1100px) 50vw, 25vw"
                    />
                  ) : (
                    <ImageSlot placeholder={category.placeholder} />
                  )}
                </div>
                <div className="panel-cap">
                  <span className="panel-name">{category.name}</span>
                  <span className="panel-short">{category.short}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <CatalogGrid products={products} categories={categories} />
    </PageShell>
  );
}
