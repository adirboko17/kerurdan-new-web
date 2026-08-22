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
                <a href={SITE.phoneHref} className="ltr home-contact-phone">
                  {SITE.phoneDisplay}
                </a>
                <a href={SITE.whatsapp} className="home-contact-wa">
                  וואטסאפ
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
