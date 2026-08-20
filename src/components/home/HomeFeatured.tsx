"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import type { Product } from "@/lib/types";

function nextIndex(current: number, length: number) {
  if (length < 2) return 0;
  let next = current;
  while (next === current) next = Math.floor(Math.random() * length);
  return next;
}

export function HomeFeatured({ products }: { products: Product[] }) {
  const usable = products.filter((product) => product.images[0]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const product = usable[index];

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
    const cards = [...root.querySelectorAll<HTMLElement>(".featured-card")];
    const endPad = parseFloat(getComputedStyle(root).paddingRight) || 0;
    const origin = root.getBoundingClientRect().right - endPad;
    let next = 0;
    let closest = Infinity;
    cards.forEach((card, cardIndex) => {
      const distance = Math.abs(card.getBoundingClientRect().right - origin);
      if (distance < closest) {
        closest = distance;
        next = cardIndex;
      }
    });
    setActive(next);
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || !window.matchMedia("(max-width: 899px)").matches) return;

    const first = root.querySelector<HTMLElement>(".featured-card");
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

  if (!product) return null;

  return (
    <section
      className="featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="featured-mobile">
        <div className="featured-mobile-head">
          <h2>מתוך הקטלוג</h2>
          <p>החליקו בין דגמים נבחרים.</p>
        </div>
        <div className="featured-track" ref={scrollerRef}>
          {usable.map((item) => (
            <article key={item.id} className="featured-card">
              <div className="featured-card-shot">
                <SiteImage src={item.images[0].src} alt={item.images[0].alt} fit="contain" padding="8%" />
              </div>
              <div className="featured-card-body">
                {item.eyebrow && <div className="featured-eyebrow">{item.eyebrow}</div>}
                <h3>{item.name}</h3>
                {item.highlights.length > 0 && (
                  <div className="stat-grid">
                    {item.highlights.slice(0, 3).map((stat) => (
                      <div className="stat" key={stat.label}>
                        <div
                          className="stat-value"
                          style={{ color: stat.accent ? "var(--ac)" : undefined }}
                        >
                          {stat.value}
                        </div>
                        <div className="stat-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                {item.features.length > 0 && (
                  <div className="chip-row">
                    {item.features.slice(0, 3).map((feature) => (
                      <span key={feature}>{feature}</span>
                    ))}
                  </div>
                )}
                <div className="featured-actions">
                  <Link href={`/product/${item.slug}`} className="btn btn-ink">
                    לפרטי המוצר
                  </Link>
                  <Link href="/contact" className="btn btn-ghost-dark">
                    הצעה
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {usable.length > 1 && (
          <div className="featured-dots" role="tablist" aria-label="דגמים נבחרים">
            {usable.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-label={item.name}
                aria-selected={active === itemIndex}
                className={`featured-dot${active === itemIndex ? " is-on" : ""}`}
                onClick={() => {
                  const card = scrollerRef.current?.querySelectorAll<HTMLElement>(".featured-card")[itemIndex];
                  if (card) alignCard(card);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="featured-desktop">
        <Reveal className="featured-grid">
          <div className="featured-media">
            <div className="featured-shot">
              {usable.map((item, itemIndex) => (
                <Image
                  key={item.id}
                  src={item.images[0].src}
                  alt={item.images[0].alt}
                  fill
                  sizes="55vw"
                  className={itemIndex === index ? "is-on" : undefined}
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                    padding: "6%",
                  }}
                />
              ))}
              {usable.length > 1 && (
                <div
                  key={product.id}
                  className={`featured-progress${paused ? " is-paused" : ""}`}
                  onAnimationEnd={() => setIndex((current) => nextIndex(current, usable.length))}
                >
                  <span />
                </div>
              )}
            </div>
          </div>

          <div className="featured-copy" key={product.id}>
            {product.eyebrow && <div className="featured-eyebrow">{product.eyebrow}</div>}
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            {product.highlights.length > 0 && (
              <div className="stat-grid">
                {product.highlights.slice(0, 3).map((item) => (
                  <div className="stat" key={item.label}>
                    <div
                      className="stat-value"
                      style={{ color: item.accent ? "var(--ac)" : undefined }}
                    >
                      {item.value}
                    </div>
                    <div className="stat-label">{item.label}</div>
                  </div>
                ))}
              </div>
            )}
            {product.features.length > 0 && (
              <div className="chip-row">
                {product.features.slice(0, 5).map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>
            )}
            <div className="featured-actions">
              <Link href={`/product/${product.slug}`} className="btn btn-ink">
                לפרטי המוצר
              </Link>
              <Link href="/contact" className="btn btn-ghost-dark">
                לקבלת הצעה
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
