import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SizeTable } from "@/components/product/SizeTable";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DarkCta } from "@/components/ui/DarkCta";
import { ProductCard } from "@/components/ui/ProductCard";
import {
  getCatalog,
  getCatalogCategory,
  getCatalogProduct,
  getRelatedProducts,
} from "@/lib/catalog";
import { SITE } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { products } = await getCatalog();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) return { title: "מוצר" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();

  const category = await getCatalogCategory(product.category);
  const related = await getRelatedProducts(product);
  const eyebrowRest = product.subcategoryName;

  return (
    <PageShell active="catalog">
      <section className="product-hero">
        <Breadcrumbs
          items={[
            { href: "/", label: "דף הבית" },
            { href: "/catalog", label: "קטלוג" },
            { href: `/catalog/${product.category}`, label: product.categoryName },
            { label: product.name },
          ]}
        />
        <div className="product-hero-grid">
          <ProductGallery product={product} />
          <div style={{ maxWidth: "min(100%, 540px)" }}>
            <div style={{ fontSize: 13.5, color: "var(--mute)" }}>
              <Link href={`/catalog/${product.category}`}>{product.categoryName}</Link>
              {eyebrowRest ? ` · ${eyebrowRest}` : null}
            </div>
            <h1 className="product-title">{product.name}</h1>
            <p className="lede">{product.description}</p>
            {product.highlights.length > 0 && (
              <div className="stat-grid">
                {product.highlights.map((item) => (
                  <div className="stat" key={item.label}>
                    <div
                      className="stat-value"
                      style={{
                        color: item.accent ? "var(--ac)" : undefined,
                        fontFamily: item.mono ? "'IBM Plex Mono', monospace" : undefined,
                      }}
                    >
                      {item.value}
                    </div>
                    <div className="stat-label">{item.label}</div>
                  </div>
                ))}
              </div>
            )}
            {product.features.length > 0 && (
              <div className="chip-row">
                {product.features.map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: "clamp(26px,3vw,38px)" }}>
              <Link href="/contact" className="btn btn-ink">
                קבלו הצעת מחיר
              </Link>
              <a href={SITE.whatsapp} className="btn btn-ghost-dark">
                דברו איתנו
              </a>
            </div>
          </div>
        </div>
      </section>

      {product.specs.length > 0 && (
        <section className="specs">
          <div className="specs-grid">
            <div>
              <h2 style={{ margin: 0, fontSize: "clamp(24px,3vw,44px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.04, maxWidth: "14ch" }}>
                מפרט טכני
              </h2>
              <p className="context-text" style={{ margin: "16px 0 0", maxWidth: "36ch" }}>
                הנתונים מתוך קטלוג קירור דן. וריאציות במידות ובגימור זמינות לפי הזמנה.
              </p>
            </div>
            <div className="spec-rows">
              {product.specs.map((row) => (
                <div className="spec-row" key={row.label}>
                  <span style={{ color: "var(--mute)", fontWeight: 300 }}>{row.label}</span>
                  <span className={row.mono ? "mono ltr" : undefined} style={{ fontWeight: row.mono ? undefined : 500 }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {product.sizeVariants.length > 0 && (
        <section className="context">
          <div className="specs-grid">
            <div>
              <h2 style={{ margin: 0, fontSize: "clamp(22px,2.6vw,38px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.06, maxWidth: "15ch" }}>
                תצורות ומידות
              </h2>
              <p className="context-text" style={{ margin: "14px 0 0", maxWidth: "38ch" }}>
                {product.sizeVariants.length === 1
                  ? "המידות של הדגם כפי שמופיעות בקטלוג."
                  : `הדגם מסופק ב־${product.sizeVariants.length} תצורות. בחרו את המידה שמתאימה לחלל.`}
              </p>
            </div>
            <div>
              <SizeTable variants={product.sizeVariants} />
              <Link href="/contact" className="link-underline link-underline-sm" style={{ marginTop: 22 }}>
                לבירור תצורה מדויקת ←
              </Link>
            </div>
          </div>
        </section>
      )}

      {product.suitable.length > 0 && (
        <section className="section-pad">
          <div className="context-grid" style={{ paddingTop: "clamp(30px,4vw,52px)" }}>
            <h2 style={{ margin: 0, fontSize: "clamp(20px,2.2vw,32px)", fontWeight: 700, letterSpacing: "-.03em", maxWidth: "14ch" }}>
              מתאים לעסקים
            </h2>
            <div className="biz-chips">
              {product.suitable.map((name) => (
                <Link href="/solutions" className="biz-chip" key={name}>
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section-pad">
          <div className="section-head">
            <h2 style={{ fontSize: "clamp(20px,2.2vw,32px)" }}>דגמים קרובים</h2>
            <Link href={`/catalog/${product.category}`} className="link-underline link-underline-sm">
              לכל {category?.name ?? product.categoryName} ←
            </Link>
          </div>
          <div className="product-grid" style={{ padding: "clamp(24px,3vw,42px) 0 0" }}>
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}

      <DarkCta
        title="רוצים לבדוק אם הדגם הזה מתאים לעסק שלכם?"
        text="השאירו פרטים ונחזור אליכם עם התאמה והצעת מחיר."
        titleWidth="19ch"
        actions={
          <>
            <Link href="/contact" className="btn btn-blue">
              קבלו הצעת מחיר
            </Link>
            <a href={SITE.phoneHref} className="btn btn-ghost-light ltr">
              {SITE.phoneDisplay}
            </a>
          </>
        }
      />
    </PageShell>
  );
}
