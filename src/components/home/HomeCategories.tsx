"use client";

import Link from "next/link";
import { useState } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { categories as fallbackCategories } from "@/lib/data";
import { MEDIA } from "@/lib/site";
import type { Category } from "@/lib/types";

const previews = [
  { src: `${MEDIA}/2025/02/SD-2.png`, alt: "חלביות" },
  null,
  { src: `${MEDIA}/2025/01/pool-1.png`, alt: "מקררים" },
  null,
] as const;

const blurbs = [
  "חלב, שתייה, פירות וירקות. מנוע פנימי או חיצוני, דלתות הזזה או פתיחה, וגם תצורה פתוחה.",
  "תצוגה מעל דלפק לבשר, גבינות ומעדנים - במידות ובתצורות שונות.",
  "עומדים, תצוגה ושירות עצמי - מדלת אחת ועד ארבע דלתות.",
  "הקפאה ואחסון לעסקים שעובדים עם מלאי קפוא.",
];

function categoryPreview(category: Category | undefined, index: number) {
  return category?.catalogImage ?? category?.image ?? previews[index] ?? null;
}

function isDesktopHover() {
  return window.matchMedia("(hover: hover) and (min-width: 900px)").matches;
}

export function HomeCategories({ categories = fallbackCategories }: { categories?: Category[] }) {
  const [active, setActive] = useState(0);
  const category = categories[active] ?? fallbackCategories[0];
  const preview = categoryPreview(category, active);

  return (
    <section className="home-cats" id="catalog">
      <div className="home-cats-grid">
        <div className="home-cats-copy">
          <Reveal>
            <h2>מה אנחנו מספקים</h2>
          </Reveal>
          {categories.map((item, index) => {
            const isOn = active === index;
            const itemPreview = categoryPreview(item, index);

            return (
              <div
                key={item.slug}
                className={`cat-item${isOn ? " is-on" : ""}${index === categories.length - 1 ? " is-last" : ""}`}
              >
                <Link
                  href={`/catalog/${item.slug}`}
                  className="cat-link"
                  aria-expanded={isOn}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={(event) => {
                    if (!isDesktopHover()) {
                      event.preventDefault();
                      setActive(index);
                    }
                  }}
                >
                  <div
                    className="cat-link-title"
                    style={{ color: isOn ? "var(--ink)" : "var(--mute-2)" }}
                  >
                    {item.name}
                  </div>
                  <p>{blurbs[index]}</p>
                </Link>

                <div className="cat-inline" id={`cat-preview-${item.slug}`}>
                  <div className="cat-inline-inner">
                    <div className="cat-inline-frame">
                      {itemPreview ? (
                        <SiteImage
                          src={itemPreview.src}
                          alt={itemPreview.alt}
                          fit="contain"
                          padding="clamp(28px,8vw,56px)"
                        />
                      ) : (
                        <ImageSlot placeholder={`צילום ${item.name} ייכנס כאן`} />
                      )}
                    </div>
                    <Link href={`/catalog/${item.slug}`} className="cat-inline-cta">
                      לצפייה בדגמים ←
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="cat-preview">
          <div className="cat-preview-frame">
            {preview ? (
              <SiteImage src={preview.src} alt={preview.alt} fit="contain" padding="clamp(40px,7vw,96px)" />
            ) : (
              <ImageSlot placeholder={`צילום ${category.name} ייכנס כאן`} />
            )}
          </div>
          <div className="cat-preview-cap">
            <span>{category.name}</span>
            <Link href={`/catalog/${category.slug}`} style={{ color: "var(--ac)" }}>
              לצפייה בדגמים ←
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
