import Link from "next/link";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { categories } from "@/lib/data";
import { SITE } from "@/lib/site";

export function Footer({ showContact = true }: { showContact?: boolean }) {
  return (
    <>
      {showContact ? (
        <section className="home-contact" id="contact">
          <Reveal className="home-contact-panel">
            <div className="home-contact-copy">
              <h2>צריכים פתרון קירור לעסק?</h2>
              <p>ספרו לנו מה אתם צריכים. אנחנו נעזור להתאים את הפתרון הנכון.</p>
              <div className="home-contact-links">
                <a href={SITE.phoneHref} className="home-contact-btn is-phone">
                  <span className="home-contact-btn-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.5 0 1 .4 1 1V20c0 .6-.5 1-1 1C9.6 21 3 14.4 3 6c0-.5.4-1 1-1h3.4c.6 0 1 .5 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1z"
                      />
                    </svg>
                  </span>
                  <span className="ltr">{SITE.phoneDisplay}</span>
                </a>
                <a
                  href={SITE.whatsapp}
                  className="home-contact-btn is-wa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="home-contact-btn-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.86 9.86 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.77 14.07c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.13.11-1.82-.11-.42-.14-.96-.31-1.66-.61-2.92-1.26-4.82-4.21-4.97-4.4-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.26-.28.58-.36.77-.36h.55c.18 0 .41-.06.64.49.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.2-.14.31-.28.48-.14.16-.3.37-.42.5-.14.14-.29.3-.12.58.16.28.73 1.2 1.56 1.94 1.08.96 1.98 1.26 2.26 1.4.28.14.44.12.61-.07.16-.2.7-.81.89-1.09.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.46.21.53.32.07.12.07.68-.17 1.36Z"
                      />
                    </svg>
                  </span>
                  <span>וואטסאפ</span>
                </a>
              </div>
            </div>
            <QuoteForm compact />
          </Reveal>
        </section>
      ) : null}

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <Logo inverted className="footer-logo" />
              <div className="footer-about">
                ייבוא ושיווק מקררים תעשייתיים לעסקים.
                <br />
                תכנון, אספקה, התקנה ושירות.
              </div>
              <div className="footer-contacts">
                <a className="footer-phone" href={SITE.phoneHref}>
                  {SITE.phoneDisplay}
                </a>
                <span className="footer-address">{SITE.address}</span>
              </div>
            </div>

            <div>
              <div className="footer-col-title">קטלוג</div>
              <div className="footer-links">
                {categories.map((category) => (
                  <Link key={category.slug} href={`/catalog/${category.slug}`}>
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="footer-col-title">קירור דן</div>
              <div className="footer-links">
                <Link href="/about">אודות</Link>
                <Link href="/projects">פרויקטים</Link>
                <Link href="/solutions">פתרונות לעסקים</Link>
                <Link href="/catalog">קטלוג</Link>
                <Link href="/contact">צור קשר</Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">מידע</div>
              <div className="footer-links">
                <Link href="/contact">קבלת הצעת מחיר</Link>
                <Link href="/accessibility">הצהרת נגישות</Link>
                <Link href="/privacy">מדיניות פרטיות</Link>
                <a href={SITE.whatsapp}>וואטסאפ</a>
                <a href={SITE.facebook}>Facebook</a>
                <a href={SITE.instagram}>Instagram</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {SITE.name}</span>
            <span className="footer-legal">
              <Link href="/accessibility">הצהרת נגישות</Link>
              <Link href="/privacy">פרטיות ועוגיות</Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
