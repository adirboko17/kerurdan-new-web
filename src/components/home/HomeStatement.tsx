import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { MEDIA } from "@/lib/site";

export function HomeStatement() {
  return (
    <section className="statement">
      <Reveal className="statement-copy">
        <p>הציוד שלנו הוא חלק מהארכיטקטורה של החנות, לא רק ארגז שעומד בפינה.</p>
        <p>
          אנחנו מייבאים ומשווקים מקררים תעשייתיים לעסקים - מרכולים, מכולות, מעדניות, קצביות ובתי קפה.
          מודדים את החלל, בוחרים תצורה, מספקים, מתקינים ונשארים בקשר.
        </p>
        <Link href="/about" className="link-underline statement-link">
          על קירור דן
        </Link>
      </Reveal>
      <Reveal className="statement-media" delay="0.1s">
        <div className="statement-frame">
          <SiteImage
            src={`${MEDIA}/2025/02/${encodeURIComponent("מנוע-פנימי-הזזה")}-1.png`}
            alt="חלבייה מנוע פנימי דלתות הזזה"
            fit="contain"
            padding="clamp(14px,3vw,46px)"
          />
        </div>
        <div className="statement-cap">חלבייה · מנוע פנימי · דלתות הזזה</div>
      </Reveal>
    </section>
  );
}
