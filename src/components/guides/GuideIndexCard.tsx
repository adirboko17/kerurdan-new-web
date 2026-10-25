import Link from "next/link";
import { GuideCoverImage } from "@/components/guides/GuideCoverImage";
import { categories } from "@/lib/data";
import { estimateReadingMinutes, getGuideCategorySlugs } from "@/lib/guide-content";
import type { GuideArticleMeta } from "@/lib/guides";

export function GuideIndexCard({ guide }: { guide: GuideArticleMeta }) {
  const categorySlugs = getGuideCategorySlugs(guide.slug);
  const primaryCategory = categories.find((item) => item.slug === categorySlugs[0]);
  const readingMinutes = estimateReadingMinutes(guide.bodyMarkdown);
  const tagLabel =
    categorySlugs.length > 1 ? `${primaryCategory?.name ?? "מדריך"} +${categorySlugs.length - 1}` : primaryCategory?.name ?? "מדריך";

  return (
    <li className="guides-grid-item">
      <Link href={`/guides/${guide.slug}`} className="guides-card">
        <div className="guides-card-media guides-card-media-cover">
          <GuideCoverImage slug={guide.slug} />
        </div>
        <div className="guides-card-body">
          <span className="guides-card-tag">{tagLabel}</span>
          <h2>{guide.h1}</h2>
          <p>{guide.excerpt}</p>
          <div className="guides-card-foot">
            <span className="guides-card-meta">{readingMinutes} דק׳ קריאה</span>
            <span className="guides-card-btn">לקריאה</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
