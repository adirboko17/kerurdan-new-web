import Link from "next/link";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SiteImage } from "@/components/ui/SiteImage";
import { categories } from "@/lib/data";
import { estimateReadingMinutes, getGuideCategorySlugs } from "@/lib/guide-content";
import type { GuideArticleMeta } from "@/lib/guides";

export function GuideIndexCard({ guide }: { guide: GuideArticleMeta }) {
  const categorySlugs = getGuideCategorySlugs(guide.slug);
  const primaryCategory = categories.find((item) => item.slug === categorySlugs[0]);
  const image = primaryCategory?.catalogImage ?? primaryCategory?.image;
  const readingMinutes = estimateReadingMinutes(guide.bodyMarkdown);
  const tagLabel =
    categorySlugs.length > 1 ? `${primaryCategory?.name ?? "מדריך"} +${categorySlugs.length - 1}` : primaryCategory?.name ?? "מדריך";

  return (
    <li className="guides-grid-item">
      <Link href={`/guides/${guide.slug}`} className="guides-card">
        <div className="guides-card-media">
          {image ? (
            <SiteImage
              src={image.src}
              alt={image.alt}
              fit="contain"
              padding="12%"
              sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 360px"
            />
          ) : (
            <ImageSlot placeholder={primaryCategory?.placeholder ?? guide.h1} />
          )}
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
