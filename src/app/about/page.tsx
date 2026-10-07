import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { BrandWall } from "@/components/ui/BrandWall";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";
import { getCatalog } from "@/lib/catalog";
import { getPartnerLogos } from "@/lib/site-content";

export const revalidate = 120;

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

export default async function AboutPage() {
  const [brands, catalog] = await Promise.all([getPartnerLogos(), getCatalog()]);
  const fridge = catalog.products.find((product) => product.name.includes("Malta D3") && product.images[0]);
  const dairyProducts = catalog.products.filter((product) => product.category === "dairy" && product.images[0]);
  const dairy =
    dairyProducts.find((product) => product.subcategoryName?.includes("מנוע פנימי") || product.name.includes("מנוע פנימי")) ??
    dairyProducts[0];
  const fridgeImage = fridge?.images[0];
  const dairyImage = dairy?.images[0];

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
            {fridgeImage ? (
              <SiteImage
                src={fridgeImage.src}
                alt={fridgeImage.alt}
                fit="contain"
                padding="8%"
                blend={false}
                sizes="(max-width: 860px) 100vw, 560px"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="about-block">
        <div className="about-split is-rev">
          <div className="about-photo about-photo-mid is-product" data-slot="about-dan">
            {dairyImage ? (
              <SiteImage
                src={dairyImage.src}
                alt={dairyImage.alt}
                fit="contain"
                padding="10%"
                blend
                sizes="(max-width: 860px) 100vw, 560px"
              />
            ) : null}
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
        <BrandWall brands={brands} />
      </section>

    </PageShell>
  );
}
