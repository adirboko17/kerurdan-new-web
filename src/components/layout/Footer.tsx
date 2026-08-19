import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { categories } from "@/lib/data";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo className="footer-logo" />
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
              <a href={SITE.whatsapp}>וואטסאפ</a>
              <a href={SITE.facebook}>Facebook</a>
              <a href={SITE.instagram}>Instagram</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {SITE.name}</span>
          <span>קירור מסחרי ותעשייתי · תכנון, אספקה והתקנה</span>
        </div>
      </div>
    </footer>
  );
}
