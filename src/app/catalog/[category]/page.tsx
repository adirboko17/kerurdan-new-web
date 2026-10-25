import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryHeroShots } from "@/components/catalog/CategoryHeroShots";
import { RelatedCategories } from "@/components/catalog/RelatedCategories";
import { CategoryModels } from "@/components/catalog/SubcategoryFilter";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteButton } from "@/components/ui/DarkCta";
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

function categoryPageTitle(category: { seoTitle?: string; name: string }) {
  if (category.seoTitle) {
    const suffix = ` | ${SITE.name}`;
    if (category.seoTitle.includes(suffix) || category.seoTitle.endsWith(SITE.name)) {
      return { absolute: category.seoTitle };
    }
    return category.seoTitle;
  }
  return category.name;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCatalogCategory(slug);
  if (!category) return { title: "קטגוריה" };
  return {
    title: categoryPageTitle(category),
    description: category.metaDescription ?? category.description,
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
  const hasSeoContent = Boolean(category.seoBody?.length || category.faq?.length);
  const faqJsonLd =
    category.faq?.length ?
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: category.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

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
            <h1>{category.h1 ?? category.name}</h1>
            <p className="cat-hero-kicker">{category.short}</p>
            <p className="cat-hero-lead">{category.intro ?? category.description}</p>
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

      {hasSeoContent ? (
        <section className="cat-seo section-pad" aria-label="מידע נוסף על הקטגוריה">
          {faqJsonLd ? (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          ) : null}
          {category.seoBody?.map((block) => (
            <article key={block.heading} className="cat-seo-block">
              <h2>{block.heading}</h2>
              {block.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          ))}
          {category.faq?.length ? (
            <div className="cat-seo-faq">
              <dl className="cat-seo-faq-list">
                {category.faq.map((item) => (
                  <div key={item.question} className="cat-seo-faq-item">
                    <dt>{item.question}</dt>
                    <dd>{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="context">
        <h2 className="section-head" style={{ border: "none", paddingBottom: 0, marginBottom: "clamp(22px,2.6vw,38px)", fontSize: "clamp(20px,2.2vw,30px)" }}>
          קטגוריות נוספות
        </h2>
        <RelatedCategories categories={related} />
      </section>

    </PageShell>
  );
}
