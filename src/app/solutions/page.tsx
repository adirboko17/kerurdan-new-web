import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { SolutionsPicker } from "@/components/solutions/SolutionsPicker";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DarkCta } from "@/components/ui/DarkCta";

export const metadata: Metadata = {
  title: "פתרונות לעסקים",
  description: "רוב הלקוחות שלנו לא יודעים איזה דגם הם צריכים - הם יודעים איזה עסק הם מנהלים.",
};

const steps = [
  { title: "מספרים לנו מה צריך", text: "עסק חדש שנפתח, החלפה של ציוד קיים, או דגם מסוים שכבר יודעים שרוצים." },
  { title: "ייעוץ והתאמה", text: "אם עוד לא בטוחים - עוברים איתכם על האפשרויות ועוזרים לבחור ציוד שמתאים לעסק ולשימוש." },
  { title: "הצעת מחיר", text: "מקבלים הצעה לציוד שנבחר." },
  { title: "אספקה", text: "מספקים את הציוד שהוזמן." },
];

export default function SolutionsPage() {
  return (
    <PageShell active="solutions">
      <section className="page-hero is-bordered">
        <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "פתרונות לעסקים" }]} />
        <div className="page-hero-grid">
          <h1>מתחילים מהעסק, לא מהדגם</h1>
          <p>רוב הלקוחות שלנו לא יודעים איזה דגם הם צריכים - הם יודעים איזה עסק הם מנהלים. בחרו סוג עסק ונראה מה בדרך כלל נדרש.</p>
        </div>
      </section>

      <SolutionsPicker />

      <section className="suitable">
        <div style={{ padding: "clamp(50px,7vw,110px) var(--pad-x)" }}>
          <h2 style={{ margin: "0 0 clamp(26px,3.4vw,48px)", fontSize: "clamp(24px,3vw,44px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.06, maxWidth: "18ch" }}>
            איך מגיעים מהעסק לפתרון
          </h2>
          <div className="cap-grid">
            {steps.map((step) => (
              <div className="cap-item" key={step.title}>
                <div style={{ fontSize: 17.5, fontWeight: 600 }}>{step.title}</div>
                <div className="context-text" style={{ marginTop: 9, fontSize: 14.5, lineHeight: 1.7 }}>
                  {step.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DarkCta
        title="ספרו לנו איזה עסק אתם פותחים"
        text="נחזור עם רשימת ציוד מותאמת והצעת מחיר."
        titleWidth="17ch"
        actions={
          <>
            <Link href="/contact" className="btn btn-blue">
              קבלו הצעת מחיר
            </Link>
            <Link href="/catalog" className="btn btn-ghost-light">
              לקטלוג המלא
            </Link>
          </>
        }
      />
    </PageShell>
  );
}
