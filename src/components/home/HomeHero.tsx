import Link from "next/link";
import { HeroVideo } from "@/components/home/HeroVideo";
import { Reveal } from "@/components/ui/Reveal";

export function HomeHero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <HeroVideo />
      </div>
      <div className="hero-shade" />

      <div className="hero-copy">
        <Reveal delay="0.15s">
          <h1>הקור שמחזיק את העסק שלך.</h1>
        </Reveal>
        <Reveal delay="0.35s">
          <div className="hero-row">
            <p>פתרונות קירור מסחריים ותעשייתיים - מהתכנון ועד ההתקנה.</p>
            <div className="hero-actions">
              <Link href="/catalog" className="btn btn-white">
                לפתרונות שלנו
              </Link>
              <Link href="/contact" className="btn btn-ghost-light">
                קבלו הצעת מחיר
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="hero-meta">
        <span>קירור מסחרי ותעשייתי · תכנון · אספקה · התקנה</span>
      </div>
    </section>
  );
}
