import Link from "next/link";
import type { GuideArticleMeta } from "@/lib/guides";

export function RelatedGuides({ guides }: { guides: GuideArticleMeta[] }) {
  if (!guides.length) return null;

  return (
    <aside className="guide-related" aria-label="מדריכים קשורים">
      <div className="guide-related-label">מדריך קשור</div>
      <ul className="guide-related-list">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link href={`/guides/${guide.slug}`}>{guide.h1}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
