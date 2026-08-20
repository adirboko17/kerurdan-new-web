import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { BrandWall } from "@/components/ui/BrandWall";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";
import { MEDIA } from "@/lib/site";

export const metadata: Metadata = {
  title: "אודות",
  description: "קירור דן מתמחה בייבוא, שיווק ואספקת ציוד קירור מסחרי ותעשייתי לעסקים ברחבי הארץ.",
};

const audiences = [
  "סופרמרקטים ומינימרקטים",
  "מעדניות וקצביות",
  "מסעדות",
  "בתי קפה",
  "מאפיות",
  "חנויות מזון",
];

export default function AboutPage() {
  return (
    <PageShell active="about">
      <section className="page-hero about-open">
        <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "אודות" }]} />
        <div className="about-open-copy">
          <h1>קירור שעובד בשביל העסק</h1>
          <p>
            <strong>קירור דן</strong> מתמחה בייבוא, שיווק ואספקת ציוד קירור מסחרי ותעשייתי לעסקים ברחבי הארץ.
          </p>
          <p>
            אנחנו מספקים חלביות, מעדניות, מקררים ומקפיאים תעשייתיים, ומתאימים את הציוד לצרכים של כל עסק
            ולשימוש היומיומי שלו.
          </p>
          <div className="about-tags">
            {audiences.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="about-block is-paper">
        <div className="about-split">
          <div>
            <h2>יודעים מה אתם צריכים. וגם כשעוד לא.</h2>
            <div className="about-cards is-stack">
              <article className="about-card">
                <span className="about-card-num">01</span>
                <h3>כבר יודעים מה מחפשים</h3>
                <p>יש לקוחות שמגיעים אלינו כשהם כבר יודעים בדיוק איזה מוצר הם צריכים. במקרה כזה אנחנו מכוונים ישר לדגם ולתצורה.</p>
              </article>
              <article className="about-card">
                <span className="about-card-num">02</span>
                <h3>עסק חדש, החלפה או התלבטות</h3>
                <p>ויש כאלה שפותחים עסק, מחליפים ציוד קיים או מתלבטים בין כמה פתרונות. אנחנו מקשיבים, מבינים את הצורך ועוזרים לבחור.</p>
              </article>
            </div>
            <p className="about-goal">
              המטרה שלנו פשוטה: לספק ללקוח פתרון שמתאים לו באמת - בלי לסבך את התהליך ובלי לדחוף ציוד שהוא לא צריך.
            </p>
          </div>
          <div className="about-photo about-photo-tall is-product" data-slot="about-need">
            <SiteImage
              src="https://pinyrmmysvagystjfonv.supabase.co/storage/v1/object/public/product-images/photospro/6e386f8d-9032-4d02-b0a5-b6e816782fc6/1781022305825-__________3___________.png"
              alt="מקרר עומד 3 דלתות"
              fit="contain"
              padding="8%"
              blend={false}
              sizes="(max-width: 860px) 100vw, 560px"
            />
          </div>
        </div>
      </section>

      <section className="about-block">
        <div className="about-split is-rev">
          <div className="about-photo about-photo-mid is-product" data-slot="about-dan">
            <SiteImage
              src={`${MEDIA}/2025/02/${encodeURIComponent("מנוע-פנימי-הזזה")}-1.png`}
              alt="חלבייה מנוע פנימי דלתות הזזה"
              fit="contain"
              padding="10%"
              blend={false}
              sizes="(max-width: 860px) 100vw, 560px"
            />
          </div>
          <div className="about-person">
            <span className="about-kicker">החברה</span>
            <h2>ניסיון, מקצועיות ושירות ישיר</h2>
            <p>
              החברה מנוהלת על ידי <strong>דן בוקובזה</strong>, שמביא ניסיון רב בתחום הקירור המסחרי ועובד באופן
              ישיר מול לקוחות, ספקים ואנשי המקצוע שמלווים את פעילות החברה.
            </p>
            <p>
              אנחנו מאמינים ששירות טוב מתחיל בזמינות, תקשורת ברורה והיכרות אמיתית עם המוצרים שאנחנו מספקים.
              גם לפני הרכישה וגם אחריה, אנחנו זמינים לתת מענה מקצועי על ציוד, התאמה, אספקה והתקנה.
            </p>
          </div>
        </div>
      </section>

      <section className="about-block is-paper">
        <div className="about-block-head">
          <h2>ציוד שמתאים לעבודה אמיתית</h2>
        </div>
        <div className="about-cards">
          <article className="about-card">
            <h3>איכות ושימוש</h3>
            <p>בוחרים ציוד שמשלב איכות, אמינות, פונקציונליות ועיצוב שמתאים לסביבה מסחרית.</p>
          </article>
          <article className="about-card">
            <h3>מגוון תצורות</h3>
            <p>הקטלוג כולל מידות, תצורות ומאפיינים טכניים שונים, לפי סוג העסק, החלל והשימוש.</p>
          </article>
          <article className="about-card">
            <h3>מתעדכנים</h3>
            <p>תחום הקירור ממשיך להתפתח, ואנחנו ממשיכים להתעדכן במוצרים ובפתרונות חדשים.</p>
          </article>
        </div>
      </section>

      <section className="about-block">
        <div className="brands-head">
          <h2>המותגים שאנחנו עובדים איתם</h2>
        </div>
        <BrandWall />
      </section>

    </PageShell>
  );
}
