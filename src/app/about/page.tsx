import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { BrandWall } from "@/components/ui/BrandWall";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "אודות",
  description: "קירור דן מספקת את הציוד שמחזיק את התצוגה, את המלאי ואת יום העבודה בעסק.",
};

const capabilities = [
  {
    title: "בחירת ציוד",
    text: "ארבע משפחות ציוד - חלביות, מעדניות, מקררים ומקפיאים תעשייתיים - בכמה תצורות, נפחים ומידות.",
  },
  {
    title: "אפיון והתאמה",
    text: "מדידה בשטח, בדיקת מעברים וחשמל, ובחירת תצורה שמתאימה לחלל ולשימוש.",
  },
  {
    title: "אספקה והתקנה",
    text: "הובלה, הצבה, חיבור והפעלה - בתיאום עם לוח הזמנים של העסק.",
  },
  {
    title: "שירות וליווי",
    text: "מענה לאורך חיי המוצר, תחזוקה והרחבות של המערך.",
  },
];

export default function AboutPage() {
  return (
    <PageShell active="about">
      <section className="about-hero">
        <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "אודות" }]} />
        <h1>קירור דן מספקת את הציוד שמחזיק את התצוגה, את המלאי ואת יום העבודה בעסק.</h1>
      </section>

      <section className="about-image">
        <div className="about-image-frame">
          <ImageSlot placeholder="צילום סביבה - מעבר מקוררים או התקנה בשטח" />
        </div>
      </section>

      <section className="context">
        <div className="context-grid">
          <p className="context-quote">אנחנו מייבאים ומשווקים מקררים תעשייתיים לעסקים.</p>
          <div className="context-text">
            העבודה שלנו מתחילה לפני הקנייה: מגיעים לעסק, מודדים את החלל, שואלים מה נכנס למקרר ובאיזה קצב, ומתאימים תצורה - לא קטלוג. מה שעובד בסופרמרקט לא בהכרח עובד בקצבייה.
          </div>
          <div className="context-text">
            אחרי האספקה אנחנו נשארים בתמונה: התקנה בשטח, התאמות, תחזוקה והרחבה של המערך כשהעסק גדל.
          </div>
        </div>
      </section>

      <section className="suitable">
        <div style={{ padding: "clamp(50px,7vw,110px) var(--pad-x)" }}>
          <h2 style={{ margin: "0 0 clamp(28px,3.6vw,50px)", fontSize: "clamp(24px,3vw,44px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.06, maxWidth: "18ch" }}>
            מה אנחנו עושים בפועל
          </h2>
          <div className="cap-grid">
            {capabilities.map((item) => (
              <div className="cap-item" key={item.title}>
                <div style={{ fontSize: 17.5, fontWeight: 600 }}>{item.title}</div>
                <div className="context-text" style={{ fontSize: 14.5, lineHeight: 1.72, marginTop: 9 }}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="context">
        <div className="brands-head">
          <h2>המותגים שאנחנו עובדים איתם</h2>
        </div>
        <BrandWall />
      </section>

      <section className="dark-cta">
        <div className="dark-cta-inner">
          <h2 style={{ maxWidth: "16ch" }}>נעים להכיר. נדבר על העסק שלכם?</h2>
          <div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 22,
                alignItems: "center",
                paddingBottom: 22,
                borderBottom: "1px solid rgba(255,255,255,.2)",
              }}
            >
              <a href={SITE.phoneHref} className="ltr" style={{ fontSize: "clamp(19px,1.9vw,28px)", fontWeight: 500, color: "#fff" }}>
                {SITE.phoneDisplay}
              </a>
              <span style={{ fontSize: 14.5, color: "rgba(255,255,255,.6)" }}>{SITE.address}</span>
            </div>
            <div className="dark-cta-actions">
              <Link href="/contact" className="btn btn-blue">
                קבלו הצעת מחיר
              </Link>
              <Link href="/projects" className="btn btn-ghost-light">
                לפרויקטים
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
