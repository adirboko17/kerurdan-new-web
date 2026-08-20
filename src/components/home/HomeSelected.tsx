"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

export function HomeSelected({ products }: { products: Product[] }) {
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
    <section className="selected">
      <div className="selected-head">
        <Reveal>
          <h2>דגמים נבחרים</h2>
        </Reveal>
        <Link href="/catalog" className="link-underline">
          לכל הקטלוג ←
        </Link>
      </div>
      <div className="selected-track" ref={scrollerRef}>
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {products.length > 1 && (
        <div className="selected-dots" role="tablist" aria-label="דגמים נבחרים">
          {products.map((product, index) => (
            <button
              key={product.slug}
              type="button"
              role="tab"
              aria-label={product.name}
              aria-selected={active === index}
              className={`selected-dot${active === index ? " is-on" : ""}`}
              onClick={() => {
                const card = scrollerRef.current?.querySelectorAll<HTMLElement>(".product-card")[index];
                if (card) alignCard(card);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
