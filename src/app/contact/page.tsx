import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "צור קשר",
  description: "ספרו לנו על העסק ועל החלל. נחזור עם תצורה מומלצת והצעה.",
};

export default function ContactPage() {
  return (
    <PageShell active="contact" dark>
      <section className="contact-page">
        <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "צור קשר" }]} />
        <div className="contact-grid">
          <div>
            <h1>קבלו הצעת מחיר</h1>
            <p className="context-text" style={{ margin: "20px 0 0", maxWidth: "38ch", color: "rgba(255,255,255,.7)", fontSize: "clamp(15px,1.2vw,18px)" }}>
              ספרו לנו על העסק ועל החלל. נחזור עם תצורה מומלצת והצעה. אם זה דחוף - עדיף להתקשר.
            </p>
            <div style={{ marginTop: "clamp(30px,3.6vw,50px)" }}>
              <a href={SITE.phoneHref} className="contact-line">
                <span className="ltr" style={{ fontSize: "clamp(20px,2vw,28px)", fontWeight: 500 }}>
                  {SITE.phoneDisplay}
                </span>
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.55)" }}>טלפון</span>
              </a>
              <a href={SITE.whatsapp} className="contact-line">
                <span style={{ fontSize: "clamp(20px,2vw,28px)", fontWeight: 500 }}>וואטסאפ</span>
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.55)" }}>הודעה מהירה</span>
              </a>
              <div className="contact-line" style={{ borderBottom: "1px solid rgba(255,255,255,.2)" }}>
                <span style={{ fontSize: "clamp(17px,1.7vw,22px)", fontWeight: 500 }}>{SITE.address}</span>
                <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.55)" }}>כתובת</span>
              </div>
            </div>
          </div>
          <QuoteForm />
        </div>
      </section>
    </PageShell>
  );
}
