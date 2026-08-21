"use client";

import Link from "next/link";
import { type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { Logo } from "@/components/ui/Logo";
import { SiteImage } from "@/components/ui/SiteImage";
import { categories } from "@/lib/data";
import type { SearchItem } from "@/lib/search";
import { NAV, SITE } from "@/lib/site";
import type { CategorySlug, NavKey, Product } from "@/lib/types";

function MobileNavSheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const dragY = useRef(0);
  const dragging = useRef(false);
  const pending = useRef(false);

  const endDrag = () => {
    pending.current = false;
    const sheet = sheetRef.current;
    if (!dragging.current || !sheet) return;
    dragging.current = false;
    sheet.classList.remove("is-dragging");
    if (dragY.current > 90) {
      onClose();
      return;
    }
    sheet.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)";
    sheet.style.transform = "";
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const sheet = sheetRef.current;
    if (!sheet || sheet.scrollTop > 4) return;
    pending.current = true;
    dragging.current = false;
    startY.current = event.clientY;
    dragY.current = 0;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const sheet = sheetRef.current;
    if (!sheet || (!pending.current && !dragging.current)) return;
    const next = Math.max(0, event.clientY - startY.current);
    if (!dragging.current) {
      if (next < 14) return;
      dragging.current = true;
      pending.current = false;
      sheet.classList.add("is-dragging");
      sheet.style.transition = "none";
    }
    dragY.current = next;
    sheet.style.transform = `translateY(${next}px)`;
  };

  return (
    <div className="mobile-nav" onClick={onClose}>
      <div
        ref={sheetRef}
        className="mobile-nav-sheet"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {children}
      </div>
    </div>
  );
}

type HeaderProps = {
  active?: NavKey;
  overlay?: boolean;
  featured?: Product[];
  searchItems?: SearchItem[];
};

export function Header({ active, overlay = false, featured = [], searchItems = [] }: HeaderProps) {
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
    const wash = getComputedStyle(document.documentElement).getPropertyValue("--header-wash").trim() || "#e4ecf0";
    let wasTop = true;

    const paintChrome = (color: string, force = false) => {
      document.documentElement.style.background = color;
      document.body.style.background = color;
      document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
        if (!force && meta.getAttribute("content") === color) return;
        meta.setAttribute("content", color);
      });
    };

    const tick = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const top = y <= 24;
      setAtTop(top);
      if (overlay) {
        setSolid(!top);
        paintChrome(wash, top && !wasTop);
      } else {
        setSolid(true);
        paintChrome(wash);
      }
      wasTop = top;
    };

    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      document.documentElement.style.background = "";
      document.body.style.background = "";
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
            <SiteSearch items={searchItems} variant="header" solid={filled} />
            <a className="header-quote" href={SITE.phoneHref}>
              {SITE.phoneDisplay}
            </a>
            <a className="header-call" href={SITE.phoneHref} aria-label={`חייגו ${SITE.phoneDisplay}`}>
              <span className="header-call-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M7.1 3.7c.4-.5 1.1-.7 1.7-.5l1.9.6c.6.2 1 .8 1.1 1.4l.3 1.8c.1.5-.1 1-.5 1.3l-1.3 1c.9 1.7 2.3 3.1 4 4l1-1.3c.3-.4.8-.6 1.3-.5l1.8.3c.6.1 1.2.5 1.4 1.1l.6 1.9c.2.6 0 1.3-.5 1.7l-.9.9c-.6.6-1.4.9-2.2.8-3.8-.5-7.3-3.2-9.6-7.2C4.8 8.1 4.7 5.8 5.8 4.6l1.3-.9Z"
                  />
                </svg>
              </span>
            </a>
            <button
              className="menu-btn"
              type="button"
              aria-label="תפריט"
              onClick={() => setNavOpen(true)}
            >
              <span />
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
        <MobileNavSheet onClose={() => setNavOpen(false)}>
          <div className="mobile-nav-top">
            <Link href="/" className="logo" aria-label={SITE.name} onClick={() => setNavOpen(false)}>
              <Logo />
            </Link>
            <div className="mobile-nav-actions">
              <a className="header-call" href={SITE.phoneHref} aria-label={`חייגו ${SITE.phoneDisplay}`}>
                <span className="header-call-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M7.1 3.7c.4-.5 1.1-.7 1.7-.5l1.9.6c.6.2 1 .8 1.1 1.4l.3 1.8c.1.5-.1 1-.5 1.3l-1.3 1c.9 1.7 2.3 3.1 4 4l1-1.3c.3-.4.8-.6 1.3-.5l1.8.3c.6.1 1.2.5 1.4 1.1l.6 1.9c.2.6 0 1.3-.5 1.7l-.9.9c-.6.6-1.4.9-2.2.8-3.8-.5-7.3-3.2-9.6-7.2C4.8 8.1 4.7 5.8 5.8 4.6l1.3-.9Z"
                    />
                  </svg>
                </span>
              </a>
              <button
                className="mobile-close"
                type="button"
                aria-label="סגירה"
                onClick={() => setNavOpen(false)}
              >
                ×
              </button>
            </div>
          </div>
          <nav className="mobile-links">
            <SiteSearch items={searchItems} variant="menu" onNavigate={() => setNavOpen(false)} />
            <Link href="/" className={active === "home" ? "is-active" : undefined} onClick={() => setNavOpen(false)}>
              דף הבית
            </Link>
            <button
              className={`mobile-sub-btn${subOpen ? " is-open" : ""}`}
              type="button"
              aria-expanded={subOpen}
              onClick={() => setSubOpen((v) => !v)}
            >
              <span>קטלוג</span>
              <span className="mobile-sub-icon">+</span>
            </button>
            <div className={`mobile-sub-wrap${subOpen ? " is-open" : ""}`}>
              <div className="mobile-sub-clip">
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
              </div>
            </div>
            <Link href="/about" className={active === "about" ? "is-active" : undefined} onClick={() => setNavOpen(false)}>
              אודות
            </Link>
            <Link href="/contact" className={active === "contact" ? "is-active" : undefined} onClick={() => setNavOpen(false)}>
              צור קשר
            </Link>
          </nav>
          <div className="mobile-cta">
            <Link href="/contact" className="btn btn-ink" onClick={() => setNavOpen(false)}>
              קבלו הצעת מחיר
            </Link>
          </div>
        </MobileNavSheet>
      )}
    </>
  );
}
