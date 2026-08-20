import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryHeroShots } from "@/components/catalog/CategoryHeroShots";
import { CategoryModels } from "@/components/catalog/SubcategoryFilter";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteButton } from "@/components/ui/DarkCta";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SiteImage } from "@/components/ui/SiteImage";
import { getCatalog, getCatalogCategory, getProductsByCategory } from "@/lib/catalog";
import { categories } from "@/lib/data";
import { SITE } from "@/lib/site";

type PageProps = {
  params: Promise<{ category: string }>;
};

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCatalogCategory(slug);
  if (!category) return { title: "קטגוריה" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const catalog = await getCatalog();
  const category = catalog.categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const items = await getProductsByCategory(category.slug);
  const related = catalog.categories.filter((item) => item.slug !== category.slug);
  const subcategories = catalog.subcategories[category.slug] ?? [];

  return (
    <PageShell active="catalog">
      <section className="cat-hero">
        <Breadcrumbs
          items={[
            { href: "/", label: "דף הבית" },
            { href: "/catalog", label: "קטלוג" },
            { label: category.name },
          ]}
        />
        <div className="cat-hero-row">
          <div className="cat-hero-copy">
            <h1>{category.name}</h1>
            <p className="cat-hero-kicker">{category.short}</p>
            <p className="cat-hero-lead">{category.description}</p>
            <div className="cat-hero-actions">
              <QuoteButton />
              {items.length ? (
                <a href="#models" className="btn btn-ghost-dark">
                  לדגמים
                </a>
              ) : (
                <a href={SITE.whatsapp} className="btn btn-ghost-dark">
                  דברו איתנו
                </a>
              )}
            </div>
          </div>
          <CategoryHeroShots products={items} />
        </div>
      </section>

      {items.length ? (
        <CategoryModels
          products={items}
          subcategories={subcategories}
          note={{ quote: category.quote, text: category.context }}
        />
      ) : (
        category.onRequest && (
          <section className="section-pad">
            <div className="pending-box">
              <div>
                <div style={{ fontSize: "clamp(19px,2vw,26px)", fontWeight: 600, letterSpacing: "-.02em" }}>
                  {category.onRequest.title}
                </div>
                <div style={{ fontSize: 15, color: "var(--mute)", marginTop: 10, fontWeight: 300, lineHeight: 1.7, maxWidth: "46ch" }}>
                  {category.onRequest.text}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <QuoteButton />
                <Link href="/catalog" className="btn btn-ghost-dark">
                  לקטלוג המלא
                </Link>
              </div>
            </div>
          </section>
        )
      )}

      <section className="context">
        <h2 className="section-head" style={{ border: "none", paddingBottom: 0, marginBottom: "clamp(22px,2.6vw,38px)", fontSize: "clamp(20px,2.2vw,30px)" }}>
          קטגוריות נוספות
        </h2>
        <div className="rel-grid">
          {related.map((item) => (
            <Link href={`/catalog/${item.slug}`} key={item.slug}>
              <div className="rel-media" style={{ background: item.image ? "var(--paper)" : "#0A0B0C" }}>
                {item.image ? (
                  <SiteImage src={item.image.src} alt={item.name} fit="contain" padding="9%" />
                ) : (
                  <ImageSlot placeholder={item.placeholder} />
                )}
              </div>
              <div style={{ paddingTop: 12, fontSize: 17, fontWeight: 600 }}>{item.name}</div>
            </Link>
          ))}
        </div>
      </section>

    </PageShell>
  );
}
