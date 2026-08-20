"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { SiteImage } from "@/components/ui/SiteImage";
import { categories } from "@/lib/data";
import { NAV, SITE } from "@/lib/site";
import type { CategorySlug, NavKey, Product } from "@/lib/types";

type HeaderProps = {
  active?: NavKey;
  overlay?: boolean;
  featured?: Product[];
};

export function Header({ active, overlay = false, featured = [] }: HeaderProps) {
  const [solid, setSolid] = useState(!overlay);
  const [atTop, setAtTop] = useState(true);
  const [megaOpen, setMegaOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [hoverCategory, setHoverCategory] = useState<CategorySlug | null>(null);

  const featurePool = featured.filter((product) => product.images[0]);
  const hoverIndex = hoverCategory
    ? featurePool.findIndex((product) => product.category === hoverCategory)
    : -1;
  const activeIndex = hoverIndex >= 0 ? hoverIndex : featureIndex;
  const activeFeature = featurePool[activeIndex] ?? featurePool[0] ?? null;

  useEffect(() => {
    const tick = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setAtTop(y <= 8);
      if (overlay) setSolid(y > 8);
      else setSolid(true);
    };

    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, [overlay]);

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  useEffect(() => {
    if (!megaOpen) setHoverCategory(null);
  }, [megaOpen]);

  const filled = solid || megaOpen;

  return (
    <>
      <header
        className={`site-header${filled ? " is-solid" : ""}${filled && atTop ? " is-top" : ""}${megaOpen ? " is-mega" : ""}${overlay ? "" : " is-page"}`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="header-bar">
          <Link href="/" className="logo" aria-label={SITE.name}>
            <Logo inverted={!filled} />
          </Link>

          <nav className="nav-wide">
            {NAV.map((item) =>
              item.key === "catalog" ? (
                <span
                  key={item.key}
                  className="catalog-trigger"
                  onMouseEnter={() => setMegaOpen(true)}
                >
                  <Link href={item.href} className={active === item.key ? "is-active" : undefined}>
                    {item.label}
                  </Link>
                  <span className="catalog-caret">▾</span>
                </span>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className={active === item.key ? "is-active" : undefined}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="header-actions">
            <a className="header-quote" href={SITE.phoneHref}>
              {SITE.phoneDisplay}
            </a>
            <button
              className="menu-btn"
              type="button"
              aria-label="תפריט"
              onClick={() => setNavOpen(true)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        {megaOpen && (
          <div className="mega">
            <div className="mega-inner">
              <div className="mega-list">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/catalog/${category.slug}`}
                    className={activeFeature?.category === category.slug ? "is-live" : undefined}
                    onMouseEnter={() => {
                      setHoverCategory(category.slug);
                      const next = featurePool.findIndex((product) => product.category === category.slug);
                      if (next >= 0) setFeatureIndex(next);
                    }}
                    onMouseLeave={() => setHoverCategory(null)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link href="/catalog" className="mega-all">
                  לכל הקטלוג ←
                </Link>
              </div>
              {activeFeature?.images[0] && (
                <Link href={`/product/${activeFeature.slug}`} className="mega-feature">
                  <div className="mega-feature-media">
                    {featurePool.map((product, itemIndex) => (
                      <SiteImage
                        key={product.id}
                        src={product.images[0].src}
                        alt={product.images[0].alt}
                        fit="contain"
                        padding="8%"
                        className={itemIndex === activeIndex ? "is-on" : undefined}
                      />
                    ))}
                    {featurePool.length > 1 && (
                      <div
                        key={`${activeFeature.id}-${hoverCategory ?? "auto"}`}
                        className={`mega-feature-bar${hoverCategory ? " is-paused" : ""}`}
                        onAnimationEnd={() => {
                          if (hoverCategory) return;
                          setFeatureIndex((current) => (current + 1) % featurePool.length);
                        }}
                      >
                        <span />
                      </div>
                    )}
                  </div>
                  <div className="mega-feature-cap" key={activeFeature.id}>
                    <span className="mega-feature-name">{activeFeature.name}</span>
                    <span className="mega-feature-tag">{activeFeature.categoryName}</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {navOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-top">
            <Logo />
            <button
              className="mobile-close"
              type="button"
              aria-label="סגירה"
              onClick={() => setNavOpen(false)}
            >
              ×
            </button>
          </div>
          <nav className="mobile-links">
            <Link href="/" onClick={() => setNavOpen(false)}>
              דף הבית
            </Link>
            <button className="mobile-sub-btn" type="button" onClick={() => setSubOpen((v) => !v)}>
              <span>קטלוג</span>
              <span style={{ fontSize: 16, opacity: 0.6 }}>{subOpen ? "−" : "+"}</span>
            </button>
            {subOpen && (
              <div className="mobile-sub">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/catalog/${category.slug}`}
                    onClick={() => setNavOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link href="/catalog" className="all" onClick={() => setNavOpen(false)}>
                  לכל הקטלוג ←
                </Link>
              </div>
            )}
            <Link href="/about" onClick={() => setNavOpen(false)}>
              אודות
            </Link>
            <Link href="/contact" onClick={() => setNavOpen(false)} style={{ borderBottom: "none" }}>
              צור קשר
            </Link>
          </nav>
          <div className="mobile-cta">
            <Link href="/contact" className="btn btn-blue" onClick={() => setNavOpen(false)}>
              קבלו הצעת מחיר
            </Link>
            <a className="mobile-phone" href={SITE.phoneHref}>
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
