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
        <div className="contact-wrap">
          <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "צור קשר" }]} />
          <div className="contact-grid">
            <div className="contact-intro">
              <p className="contact-kicker">קירור דן · באר שבע</p>
              <h1>קבלו הצעת מחיר</h1>
              <p className="contact-lede">
                ספרו לנו על העסק ועל החלל. נחזור עם תצורה מומלצת והצעה. אם זה דחוף - עדיף להתקשר.
              </p>
              <div className="contact-cards">
                <a href={SITE.phoneHref} className="contact-card">
                  <span className="contact-card-label">טלפון</span>
                  <span className="contact-card-value ltr">{SITE.phoneDisplay}</span>
                </a>
                <a href={SITE.whatsapp} className="contact-card">
                  <span className="contact-card-label">הודעה מהירה</span>
                  <span className="contact-card-value">וואטסאפ</span>
                </a>
                <div className="contact-card">
                  <span className="contact-card-label">כתובת</span>
                  <span className="contact-card-value">{SITE.address}</span>
                </div>
              </div>
            </div>
            <QuoteForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
