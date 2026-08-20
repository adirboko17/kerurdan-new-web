"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ImageFit, Product } from "@/lib/types";

type ProductCarouselProps = {
  products: Product[];
  className?: string;
  showCategory?: boolean;
  imageFit?: ImageFit;
};

export function ProductCarousel({
  products,
  className = "",
  showCategory = true,
  imageFit,
}: ProductCarouselProps) {
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
    const cards = [...root.querySelectorAll<HTMLElement>(".product-card")];
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

    const first = root.querySelector<HTMLElement>(".product-card");
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

  if (!products.length) return null;

  return (
    <div className={`product-carousel ${className}`.trim()}>
      <div className="product-track" ref={scrollerRef}>
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            showCategory={showCategory}
            note={product.note}
            imageFit={imageFit}
          />
        ))}
      </div>
      {products.length > 1 && (
        <div className="product-track-dots" role="tablist" aria-label="דגמים">
          {products.map((product, index) => (
            <button
              key={product.slug}
              type="button"
              role="tab"
              aria-label={product.name}
              aria-selected={active === index}
              className={`product-track-dot${active === index ? " is-on" : ""}`}
              onClick={() => {
                const card = scrollerRef.current?.querySelectorAll<HTMLElement>(".product-card")[index];
                if (card) alignCard(card);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
