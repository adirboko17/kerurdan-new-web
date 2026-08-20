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
                ספרו לנו על העסק ועל החלל. נחזור עם תצורה מומלצת והצעה. אם זה דחוף — עדיף להתקשר.
              </p>
              <div className="contact-cards">
                <a href={SITE.phoneHref} className="contact-card is-phone">
                  <span className="contact-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.5 0 1 .4 1 1V20c0 .6-.5 1-1 1C9.6 21 3 14.4 3 6c0-.5.4-1 1-1h3.4c.6 0 1 .5 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1z"
                      />
                    </svg>
                  </span>
                  <span className="contact-card-text">
                    <span className="contact-card-label">חייגו עכשיו</span>
                    <span className="contact-card-value ltr">{SITE.phoneDisplay}</span>
                  </span>
                </a>
                <a href={SITE.whatsapp} className="contact-card is-wa">
                  <span className="contact-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.86 9.86 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.77 14.07c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.13.11-1.82-.11-.42-.14-.96-.31-1.66-.61-2.92-1.26-4.82-4.21-4.97-4.4-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.26-.28.58-.36.77-.36h.55c.18 0 .41-.06.64.49.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.2-.14.31-.28.48-.14.16-.3.37-.42.5-.14.14-.29.3-.12.58.16.28.73 1.2 1.56 1.94 1.08.96 1.98 1.26 2.26 1.4.28.14.44.12.61-.07.16-.2.7-.81.89-1.09.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.46.21.53.32.07.12.07.68-.17 1.36Z"
                      />
                    </svg>
                  </span>
                  <span className="contact-card-text">
                    <span className="contact-card-label">הודעה מהירה</span>
                    <span className="contact-card-value">וואטסאפ</span>
                  </span>
                </a>
                <div className="contact-card is-address">
                  <span className="contact-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12 2.5c3.7 0 6.7 3 6.7 6.7 0 4.6-5.4 10.4-6.3 11.3-.2.2-.6.2-.8 0-.9-.9-6.3-6.7-6.3-11.3 0-3.7 3-6.7 6.7-6.7Zm0 4.4a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6Z"
                      />
                    </svg>
                  </span>
                  <span className="contact-card-text">
                    <span className="contact-card-label">כתובת</span>
                    <span className="contact-card-value">{SITE.address}</span>
                  </span>
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
