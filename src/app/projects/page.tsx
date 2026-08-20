import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";

export const metadata: Metadata = {
  title: "פרויקטים",
  description: "כל התקנה מתחילה בחלל אמיתי ובאילוצים אמיתיים - מעברים, חשמל, גובה תקרה וקצב עבודה.",
};

export default function ProjectsPage() {
  return (
    <PageShell active="projects">
      <section className="page-hero">
        <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "פרויקטים" }]} />
        <div className="page-hero-grid">
          <h1>התקנות בשטח</h1>
          <p>כל התקנה מתחילה בחלל אמיתי ובאילוצים אמיתיים - מעברים, חשמל, גובה תקרה וקצב עבודה. כאן ייכנס תיעוד הפרויקטים של קירור דן.</p>
        </div>
      </section>

      <section style={{ padding: "0 0 clamp(40px,5vw,80px)" }}>
        <div className="proj-big">
          <div style={{ position: "absolute", inset: 0 }}>
            <SiteImage
              src="/projects/supermarket.jpg"
              alt="קיר קירור לסופרמרקט"
              fit="cover"
              sizes="100vw"
              priority
            />
          </div>
          <div className="hero-shade" style={{ background: "linear-gradient(180deg,rgba(10,11,12,.35),transparent 45%,rgba(10,11,12,.85))" }} />
          <div style={{ position: "absolute", right: 0, left: 0, bottom: 0, padding: "clamp(20px,3vw,40px) var(--pad-x)" }}>
            <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(24px,3.2vw,50px)", fontWeight: 700, letterSpacing: "-.035em", lineHeight: 1.04, maxWidth: "16ch" }}>
              קיר קירור לסופרמרקט
            </h2>
          </div>
        </div>
        <div
          style={{
            padding: "clamp(20px,2.6vw,36px) var(--pad-x) 0",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,150px),1fr))",
            gap: "clamp(16px,2.4vw,40px)",
          }}
        >
          <Meta label="לקוח" value="עטרה" />
          <Meta label="מיקום" value="צפון" />
          <Meta label="סוג התקנה" value="מערך תצוגה ואחסון" />
          <Meta label="ציוד" value="חלביות" />
        </div>
      </section>

      <section className="px" style={{ paddingBottom: "clamp(40px,5vw,80px)" }}>
        <div className="proj-split">
          <div className="rel-media proj-shot proj-deli">
            <SiteImage
              src="/projects/deli-vitrine.jpg"
              alt="ויטרינות מעדנייה לקצבייה"
              fit="cover"
              sizes="(max-width: 860px) 100vw, 55vw"
            />
          </div>
          <ProjectCopy
            title="ויטרינות מעדנייה לקצבייה"
            text="תצוגה מעל דלפק לבשר ולקצבייה, בגובה ובעומק שמתאימים לעבודה מאחורי הדלפק לאורך כל היום."
            client="נתח קצבים"
            location="מרכז"
            equipment="מעדניות"
          />
        </div>
      </section>

      <section className="px" style={{ paddingBottom: "clamp(50px,7vw,110px)" }}>
        <div className="proj-split is-rev">
          <ProjectCopy
            title="מערך הקפאה לסופר שכונתי"
            text="מקפיאים שוכבים מתחת למידוף, לפי כמות המלאי."
            client="סופר השכונה"
            location="מרכז"
            equipment="מקפיאים"
          />
          <div className="rel-media proj-shot">
            <SiteImage
              src="/projects/butcher-freezers.jpg"
              alt="מערך הקפאה לסופר שכונתי"
              fit="cover"
              sizes="(max-width: 860px) 100vw, 55vw"
            />
          </div>
        </div>
      </section>

      <section className="suitable">
        <div style={{ padding: "clamp(46px,6vw,96px) var(--pad-x)" }}>
          <h2 style={{ margin: "0 0 clamp(22px,2.8vw,40px)", fontSize: "clamp(22px,2.6vw,38px)", fontWeight: 700, letterSpacing: "-.03em", maxWidth: "22ch" }}>
            תיעוד נוסף מהשטח
          </h2>
          <div className="rel-grid">
            {[
              { src: "/projects/field-1.jpg", alt: "מקרר שתייה משולב במדפי עץ" },
              { src: "/projects/field-2.jpg", alt: "מקרר תצוגה שחור רב דלתות" },
              { src: "/projects/field-3.jpg", alt: "חלביית ירקות בסופרמרקט" },
              { src: "/projects/field-4.jpg", alt: "ויטרינות תצוגה למעדנייה" },
            ].map((shot) => (
              <div key={shot.src} className="rel-media" style={{ aspectRatio: "4 / 5", background: "#0A0B0C" }}>
                <SiteImage src={shot.src} alt={shot.alt} fit="cover" sizes="(max-width: 860px) 100vw, 25vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

    </PageShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, color: "var(--mute)" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 500, marginTop: 7 }}>{value}</div>
    </div>
  );
}

function ProjectCopy({
  title,
  text,
  client = "-",
  location = "-",
  equipment,
}: {
  title: string;
  text: string;
  client?: string;
  location?: string;
  equipment: string;
}) {
  return (
    <div>
      <h2 style={{ margin: 0, fontSize: "clamp(22px,2.8vw,42px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.06, maxWidth: "16ch" }}>
        {title}
      </h2>
      <p className="context-text" style={{ margin: "14px 0 0", maxWidth: "40ch" }}>
        {text}
      </p>
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 16 }}>
        <Meta label="לקוח" value={client} />
        <Meta label="מיקום" value={location} />
        <Meta label="ציוד" value={equipment} />
      </div>
    </div>
  );
}
