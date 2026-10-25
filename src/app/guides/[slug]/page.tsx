import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticleHeader } from "@/components/guides/GuideArticleHeader";
import { GuideContactCta } from "@/components/guides/GuideContactCta";
import { GuideFaqAccordion } from "@/components/guides/GuideFaqAccordion";
import { GuideMoreArticles } from "@/components/guides/GuideMoreArticles";
import { GuideRelatedCatalog } from "@/components/guides/GuideRelatedCatalog";
import { PageShell } from "@/components/layout/PageShell";
import {
  extractShortAnswer,
  markdownForArticleBody,
} from "@/lib/guide-content";
import { GuideMarkdownBody, renderGuideInline } from "@/lib/guide-markdown";
import { getAllGuides, getGuideBySlug } from "@/lib/guides";
import { guideCoverOgUrl } from "@/lib/guide-covers";
import { withCanonical } from "@/lib/metadata";
import { SITE } from "@/lib/site";
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
  const coverUrl = guideCoverOgUrl(slug);
  return withCanonical(`/guides/${slug}`, {
    title: { absolute: guide.seoTitle },
    description: guide.metaDescription,
    openGraph: {
      title: guide.seoTitle,
      description: guide.metaDescription,
      url: `${SITE.url}/guides/${slug}`,
      siteName: SITE.name,
      locale: "he_IL",
      type: "article",
      ...(coverUrl ? { images: [{ url: coverUrl, alt: guide.h1 }] } : {}),
    },
    twitter: coverUrl
      ? {
          card: "summary_large_image",
          title: guide.seoTitle,
          description: guide.metaDescription,
          images: [coverUrl],
        }
      : undefined,
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
  const shortAnswer = extractShortAnswer(guide.bodyMarkdown);
  const bodyMarkdown = markdownForArticleBody(guide.bodyMarkdown);

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

      <div className="guide-page">
        <GuideArticleHeader guide={guide} breadcrumbItems={breadcrumbItems} />

        <div className="guide-container guide-article-layout">
          {shortAnswer ? (
            <aside className="guide-short-answer" aria-label="תשובה קצרה">
              <div className="guide-short-kicker">תשובה קצרה</div>
              <p>{renderGuideInline(shortAnswer, "short-answer")}</p>
            </aside>
          ) : null}

          <article className="guide-prose">
            <GuideMarkdownBody markdown={bodyMarkdown} />
          </article>

          <GuideFaqAccordion faq={guide.faq} />
        </div>

        <GuideRelatedCatalog slug={slug} bodyMarkdown={guide.bodyMarkdown} />
        <GuideContactCta />
        <GuideMoreArticles currentSlug={slug} />
      </div>
    </PageShell>
  );
}
