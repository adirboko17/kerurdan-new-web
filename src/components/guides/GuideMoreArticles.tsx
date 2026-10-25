import Link from "next/link";
import { GuideCoverImage } from "@/components/guides/GuideCoverImage";
import { estimateReadingMinutes } from "@/lib/guide-content";
import { getAllGuides } from "@/lib/guides";

export function GuideMoreArticles({ currentSlug }: { currentSlug: string }) {
  const others = getAllGuides().filter((guide) => guide.slug !== currentSlug);
  if (!others.length) return null;

  return (
    <section className="guide-more">
      <div className="guide-container">
        <h2 className="guide-section-title">מאמרים נוספים</h2>
        <ul className="guides-grid guides-grid-compact">
          {others.map((guide) => (
            <li key={guide.slug} className="guides-grid-item">
              <Link href={`/guides/${guide.slug}`} className="guides-card">
                <div className="guides-card-media guides-card-media-cover">
                  <GuideCoverImage slug={guide.slug} />
                </div>
                <div className="guides-card-body">
                  <h3>{guide.h1}</h3>
                  <p>{guide.excerpt}</p>
                  <div className="guides-card-foot">
                    <span className="guides-card-meta">{estimateReadingMinutes(guide.bodyMarkdown)} דק׳ קריאה</span>
                    <span className="guides-card-btn">לקריאה</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
