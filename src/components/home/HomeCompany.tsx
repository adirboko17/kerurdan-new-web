import { BrandWall } from "@/components/ui/BrandWall";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

export function HomeCompany() {
  return (
    <>
      <section className="company" id="company">
        <Reveal className="company-inner">
          <p className="company-quote">בחירת הציוד היא החלטה תפעולית. אנחנו עוזרים לקבל אותה נכון.</p>
          <div className="company-copy">
            <div>
              מה שעובד בסופרמרקט לא בהכרח עובד בקצבייה. אנחנו מגיעים לעסק, מודדים, שואלים מה נכנס למקרר
              ובאיזה קצב, ומתאימים תצורה - לא קטלוג.
            </div>
            <div>אחרי ההתקנה אנחנו נשארים בתמונה. תחזוקה, התאמות והרחבות של המערך כשהעסק גדל.</div>
          </div>
        </Reveal>
      </section>

      <section className="brands">
        <Reveal>
          <div className="brands-head">
            <h2>המותגים שאנחנו עובדים איתם</h2>
          </div>
          <BrandWall />
        </Reveal>
      </section>

      <section className="home-contact" id="contact">
        <Reveal className="home-contact-grid">
          <div>
            <h2>צריכים פתרון קירור לעסק?</h2>
            <p>ספרו לנו מה אתם צריכים. אנחנו נעזור להתאים את הפתרון הנכון.</p>
            <div className="home-contact-links">
              <a href={SITE.phoneHref} style={{ fontSize: "clamp(19px,1.9vw,28px)", fontWeight: 500, color: "#fff" }} className="ltr">
                {SITE.phoneDisplay}
              </a>
              <a
                href={SITE.whatsapp}
                style={{
                  fontSize: 14.5,
                  color: "rgba(255,255,255,.7)",
                  borderBottom: "1px solid rgba(255,255,255,.3)",
                  paddingBottom: 2,
                }}
              >
                וואטסאפ
              </a>
            </div>
          </div>
          <QuoteForm compact />
        </Reveal>
      </section>
    </>
  );
}
