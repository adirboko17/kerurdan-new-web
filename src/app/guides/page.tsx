import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAllGuides } from "@/lib/guides";
import { withCanonical } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 120;

export const metadata: Metadata = withCanonical("/guides", {
  title: "מאמרים ומדריכים",
  description:
    "מדריכים לבחירת ציוד קירור לעסק: חלביות, מעדניות, מקררים ומקפיאים. קירור דן, מעל 30 שנה בענף.",
});

export default function GuidesIndexPage() {
  const guides = getAllGuides();
  const breadcrumbItems = [
    { href: "/", label: "דף הבית" },
    { label: "מאמרים ומדריכים" },
  ];

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)) }}
      />
      <section className="page-hero is-bordered">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="page-hero-grid">
          <h1>מאמרים ומדריכים</h1>
          <p>
            מדריכים קצרים לבחירת ציוד קירור לעסק – חלביות, מעדניות, מקררי תצוגה ומקפיאים. כתובים בשפה
            פשוטה מניסיון של קירור דן בענף.
          </p>
        </div>
      </section>

      <section className="guides-index section-pad">
        <ul className="guides-list">
          {guides.map((guide) => (
            <li key={guide.slug} className="guides-list-item">
              <Link href={`/guides/${guide.slug}`} className="guides-card">
                <h2>{guide.h1}</h2>
                <p>{guide.excerpt}</p>
                <span className="guides-card-link">למדריך</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
