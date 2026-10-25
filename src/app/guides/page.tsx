import type { Metadata } from "next";
import { GuideIndexCard } from "@/components/guides/GuideIndexCard";
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
      <div className="guides-page">
        <section className="guides-hero">
          <div className="guide-container guides-hero-inner">
            <Breadcrumbs items={breadcrumbItems} />
            <h1>מאמרים ומדריכים</h1>
            <p>
              מדריכים קצרים לבחירת ציוד קירור לעסק – חלביות, מעדניות, מקררי תצוגה ומקפיאים. כתובים
              בשפה פשוטה מניסיון של קירור דן בענף.
            </p>
          </div>
        </section>

        <section className="guides-index" aria-label="רשימת מאמרים">
          <div className="guide-container">
            <ul className="guides-grid">
              {guides.map((guide) => (
                <GuideIndexCard key={guide.slug} guide={guide} />
              ))}
            </ul>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
