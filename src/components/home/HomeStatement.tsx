import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";

export function HomeStatement() {
  return (
    <section className="statement">
      <Reveal className="statement-copy">
        <p>הציוד שלנו הוא חלק מהארכיטקטורה של החנות, לא רק ארגז שעומד בפינה.</p>
        <p>
          אנחנו מייבאים ומשווקים מקררים תעשייתיים לעסקים - מרכולים, מכולות, מעדניות, קצביות ובתי קפה.
          מבינים את החלל, בוחרים תצורה, מספקים, מתקינים ונשארים בקשר.
        </p>
        <Link href="/about" className="link-underline statement-link">
          על קירור דן
        </Link>
      </Reveal>
      <Reveal className="statement-media" delay="0.1s">
        <div className="statement-frame">
          <SiteImage
            src="/statement-open.png"
            alt="חלבייה מנוע פנימי פתוחה"
            fit="contain"
            padding="clamp(14px,3vw,46px)"
            blend={false}
          />
        </div>
        <div className="statement-cap">חלבייה · מנוע פנימי · פתוחה</div>
      </Reveal>
    </section>
  );
}
