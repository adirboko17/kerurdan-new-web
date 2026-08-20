"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SiteImage } from "@/components/ui/SiteImage";
import type { Category } from "@/lib/types";

export function RelatedCategories({ categories }: { categories: Category[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const alignCard = useCallback((card: HTMLElement, behavior: ScrollBehavior = "smooth") => {
    const root = scrollerRef.current;
    if (!root) return;
    const endPad = parseFloat(getComputedStyle(root).paddingRight) || 0;
    root.scrollTo({
      left:
        root.scrollLeft +
        card.getBoundingClientRect().right -
        (root.getBoundingClientRect().right - endPad),
      behavior,
    });
  }, []);

  const syncActive = useCallback(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>(".rel-card")];
    const endPad = parseFloat(getComputedStyle(root).paddingRight) || 0;
    const origin = root.getBoundingClientRect().right - endPad;
    let next = 0;
    let closest = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().right - origin);
      if (distance < closest) {
        closest = distance;
        next = index;
      }
    });
    setActive(next);
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || !window.matchMedia("(max-width: 899px)").matches) return;

    const first = root.querySelector<HTMLElement>(".rel-card");
    if (first) alignCard(first, "auto");

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncActive);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    syncActive();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", onScroll);
    };
  }, [alignCard, syncActive]);

  if (!categories.length) return null;

  return (
    <div className="rel-carousel">
      <div className="rel-grid" ref={scrollerRef}>
        {categories.map((item) => (
          <Link href={`/catalog/${item.slug}`} key={item.slug} className="rel-card">
            <div className="rel-media" style={{ background: item.image ? "var(--paper)" : "#0A0B0C" }}>
              {item.image ? (
                <SiteImage src={item.image.src} alt={item.name} fit="contain" padding="9%" />
              ) : (
                <ImageSlot placeholder={item.placeholder} />
              )}
            </div>
            <div className="rel-card-name">{item.name}</div>
          </Link>
        ))}
      </div>
      {categories.length > 1 && (
        <div className="product-track-dots" role="tablist" aria-label="קטגוריות נוספות">
          {categories.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-label={item.name}
              aria-selected={active === index}
              className={`product-track-dot${active === index ? " is-on" : ""}`}
              onClick={() => {
                const card = scrollerRef.current?.querySelectorAll<HTMLElement>(".rel-card")[index];
                if (card) alignCard(card);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
