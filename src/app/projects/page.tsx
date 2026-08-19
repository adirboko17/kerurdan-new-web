import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DarkCta } from "@/components/ui/DarkCta";
import { ImageSlot } from "@/components/ui/ImageSlot";

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
            <ImageSlot placeholder="פרויקט - סופרמרקט, צילום ראשי לרוחב מלא" />
          </div>
          <div className="hero-shade" style={{ background: "linear-gradient(180deg,rgba(10,11,12,.35),transparent 45%,rgba(10,11,12,.85))" }} />
          <div style={{ position: "absolute", right: 0, left: 0, bottom: 0, padding: "clamp(20px,3vw,40px) var(--pad-x)" }}>
            <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(24px,3.2vw,50px)", fontWeight: 700, letterSpacing: "-.035em", lineHeight: 1.04, maxWidth: "16ch" }}>
              מערך קירור לסופרמרקט
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
          <Meta label="לקוח" value="-" />
          <Meta label="מיקום" value="-" />
          <Meta label="סוג התקנה" value="מערך תצוגה ואחסון" />
          <Meta label="ציוד" value="חלביות · מקררים" />
          <div style={{ alignSelf: "end" }}>
            <Link href="/contact" className="link-underline link-underline-sm">
              לפרויקט המלא ←
            </Link>
          </div>
        </div>
      </section>

      <section className="px" style={{ paddingBottom: "clamp(40px,5vw,80px)" }}>
        <div className="proj-split">
          <div className="rel-media" style={{ aspectRatio: "4 / 3", background: "#0A0B0C" }}>
            <ImageSlot placeholder="פרויקט - מעדנייה" />
          </div>
          <ProjectCopy
            title="ויטרינת מעדנייה"
            text="תצוגה מעל דלפק לגבינות ומעדנים, בגובה ובעומק שמתאימים לעבודה מאחורי הדלפק לאורך כל היום."
            equipment="מעדניות"
          />
        </div>
      </section>

      <section className="px" style={{ paddingBottom: "clamp(50px,7vw,110px)" }}>
        <div className="proj-split is-rev">
          <ProjectCopy
            title="מערך הקפאה לקצבייה"
            text="מקפיאי עומד ושוכב לפי כמות המלאי, לצד ויטרינת תצוגה מעל הדלפק."
            equipment="מקפיאים · מעדניות"
          />
          <div className="rel-media" style={{ aspectRatio: "4 / 3", background: "#0A0B0C" }}>
            <ImageSlot placeholder="פרויקט - קצבייה" />
          </div>
        </div>
      </section>

      <section className="suitable">
        <div style={{ padding: "clamp(46px,6vw,96px) var(--pad-x)" }}>
          <h2 style={{ margin: "0 0 clamp(22px,2.8vw,40px)", fontSize: "clamp(22px,2.6vw,38px)", fontWeight: 700, letterSpacing: "-.03em", maxWidth: "22ch" }}>
            תיעוד נוסף מהשטח
          </h2>
          <div className="rel-grid">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="rel-media" style={{ aspectRatio: "4 / 5", background: "#0A0B0C" }}>
                <ImageSlot placeholder="צילום התקנה" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <DarkCta
        title="מתכננים חנות חדשה או שדרוג?"
        text="נשמח להגיע, למדוד ולהציע מערך שמתאים לחלל ולקצב העבודה."
        titleWidth="17ch"
        actions={
          <>
            <Link href="/contact" className="btn btn-blue">
              קבלו הצעת מחיר
            </Link>
            <Link href="/catalog" className="btn btn-ghost-light">
              לקטלוג
            </Link>
          </>
        }
      />
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

function ProjectCopy({ title, text, equipment }: { title: string; text: string; equipment: string }) {
  return (
    <div>
      <h2 style={{ margin: 0, fontSize: "clamp(22px,2.8vw,42px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.06, maxWidth: "16ch" }}>
        {title}
      </h2>
      <p className="context-text" style={{ margin: "14px 0 0", maxWidth: "40ch" }}>
        {text}
      </p>
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 16 }}>
        <Meta label="לקוח" value="-" />
        <Meta label="מיקום" value="-" />
        <Meta label="ציוד" value={equipment} />
      </div>
      <Link href="/contact" className="link-underline link-underline-sm" style={{ marginTop: 24 }}>
        לפרויקט המלא ←
      </Link>
    </div>
  );
}
