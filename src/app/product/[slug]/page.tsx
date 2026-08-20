import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ProductBlueprint } from "@/components/product/ProductBlueprint";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductQuoteButton } from "@/components/product/ProductQuoteButton";
import { SizeTable } from "@/components/product/SizeTable";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import { getProductBlueprint } from "@/lib/blueprints";
import {
  getCatalog,
  getCatalogProduct,
  getComplementaryProducts,
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

  const complementary = await getComplementaryProducts(product);
  const blueprint = getProductBlueprint(product);
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
          <div className="product-copy">
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
            <div className="product-actions">
              <ProductQuoteButton
                productName={product.name}
                productSlug={product.slug}
                productId={product.id}
              />
              <a
                href={SITE.whatsappMessage(`היי אני מתעניין ב ${product.name}`)}
                className="btn-wa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="שלחו הודעת וואטסאפ"
              >
                <img src="/whatsapp.svg" alt="" />
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
                  <span style={{ fontWeight: 500 }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(product.sizeVariants.length > 0 || blueprint) && (
        <section className="context">
          <div className={blueprint ? "size-section" : "specs-grid"}>
            <div className={blueprint ? "size-section-copy" : undefined}>
              <div>
                <h2 style={{ margin: 0, fontSize: "clamp(22px,2.6vw,38px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.06, maxWidth: "15ch" }}>
                  תצורות ומידות
                </h2>
                <p className="context-text" style={{ margin: "14px 0 0", maxWidth: "38ch" }}>
                  {product.sizeVariants.length === 1
                    ? "המידות של הדגם כפי שמופיעות בקטלוג."
                    : product.sizeVariants.length > 1
                      ? `הדגם מסופק ב־${product.sizeVariants.length} תצורות. בחרו את המידה שמתאימה לחלל.`
                      : "שרטוט המידות של הדגם, כעזר לבחירת התצורה שמתאימה לחלל."}
                </p>
              </div>
              {product.sizeVariants.length > 0 ? <SizeTable variants={product.sizeVariants} /> : null}
            </div>
            {blueprint ? <ProductBlueprint blueprint={blueprint} /> : null}
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

      {complementary.length > 0 && (
        <section className="section-pad">
          <div className="section-head">
            <h2 style={{ fontSize: "clamp(20px,2.2vw,32px)" }}>מוצרים משלימים</h2>
            <Link href="/catalog" className="link-underline link-underline-sm">
              לכל הקטלוג ←
            </Link>
          </div>
          <ProductCarousel products={complementary} className="related-carousel" />
        </section>
      )}

    </PageShell>
  );
}
