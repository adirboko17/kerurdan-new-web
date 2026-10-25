import { GuideCoverImage } from "@/components/guides/GuideCoverImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { estimateReadingMinutes } from "@/lib/guide-content";
import type { GuideArticleMeta } from "@/lib/guides";

type GuideArticleHeaderProps = {
  guide: GuideArticleMeta;
  breadcrumbItems: { href?: string; label: string }[];
};

export function GuideArticleHeader({ guide, breadcrumbItems }: GuideArticleHeaderProps) {
  const readingMinutes = estimateReadingMinutes(guide.bodyMarkdown);

  return (
    <header className="guide-hero">
      <div className="guide-container guide-hero-inner">
        <Breadcrumbs items={breadcrumbItems} />
        <h1>{guide.h1}</h1>
        <div className="guide-hero-meta">
          <span>{readingMinutes} דק׳ קריאה</span>
          <span className="guide-hero-dot" aria-hidden="true">
            ·
          </span>
          <span className="guide-hero-trust">מעל 30 שנה בענף</span>
        </div>
        <p className="guide-lead">{guide.excerpt}</p>
        <div className="guide-hero-cover">
          <GuideCoverImage slug={guide.slug} priority />
        </div>
      </div>
    </header>
  );
}
