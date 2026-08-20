import Link from "next/link";
import { BrandWall } from "@/components/ui/BrandWall";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { Reveal } from "@/components/ui/Reveal";
import { getPartnerLogos } from "@/lib/site-content";

export function HomeCompany() {
  return (
    <section className="company" id="company">
      <Reveal className="company-inner">
        <div className="company-panel">
          <div className="company-intro">
            <p className="company-quote">בחירת הציוד היא החלטה תפעולית. אנחנו עוזרים לקבל אותה נכון.</p>
            <div className="company-facts">
              <div>
                <span>04</span>
                משפחות ציוד
              </div>
              <div>
                <span>01</span>
                התאמה לעסק
              </div>
              <div>
                <span>+</span>
                ליווי אחרי התקנה
              </div>
            </div>
            <Link href="/contact" className="link-underline">
              לשיחה על העסק ←
            </Link>
          </div>
          <QuoteForm light />
        </div>
        <div className="company-points">
          <div className="company-point">
            <span className="company-num">01</span>
            <p>
              מה שעובד בסופרמרקט לא בהכרח עובד בקצבייה. שואלים מה נכנס למקרר ובאיזה קצב, ומתאימים תצורה
              לעסק.
            </p>
          </div>
          <div className="company-point">
            <span className="company-num">02</span>
            <p>מתאימים תצורה לחלל ולשימוש - לא דף מקטלוג. לפי סוג העסק, מה שנכנס למקרר ואיך עובדים איתו.</p>
          </div>
          <div className="company-point">
            <span className="company-num">03</span>
            <p>אחרי ההתקנה אנחנו נשארים בתמונה. תחזוקה, התאמות והרחבות של המערך כשהעסק גדל.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export async function HomeClosing() {
  const brands = await getPartnerLogos();

  return (
    <section className="brands">
      <Reveal>
        <div className="brands-head">
          <h2>המותגים שאנחנו עובדים איתם</h2>
        </div>
        <BrandWall brands={brands} />
      </Reveal>
    </section>
  );
}
