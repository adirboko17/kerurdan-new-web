import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideContactCta } from "@/components/guides/GuideContactCta";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GuideMarkdownBody } from "@/lib/guide-markdown";
import { getAllGuides, getGuideBySlug } from "@/lib/guides";
import { withCanonical } from "@/lib/metadata";
import { articleJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 120;

export async function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "מדריך" };
  return withCanonical(`/guides/${slug}`, {
    title: { absolute: guide.seoTitle },
    description: guide.metaDescription,
  });
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const breadcrumbItems = [
    { href: "/", label: "דף הבית" },
    { href: "/guides", label: "מאמרים ומדריכים" },
    { label: guide.h1 },
  ];

  const faqJsonLd = faqPageJsonLd(guide.faq);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              headline: guide.h1,
              description: guide.metaDescription,
              slug: guide.slug,
              datePublished: guide.datePublished,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)) }}
      />
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      <section className="page-hero">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="page-hero-grid">
          <h1>{guide.h1}</h1>
        </div>
      </section>

      <article className="legal guide-article">
        <div className="legal-body guide-body">
          <GuideMarkdownBody markdown={guide.bodyMarkdown} />
        </div>
      </article>

      <GuideContactCta />
    </PageShell>
  );
}
