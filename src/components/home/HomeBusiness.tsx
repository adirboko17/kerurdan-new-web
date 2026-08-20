"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { businesses } from "@/lib/data";

export function HomeBusiness() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const business = businesses[active];

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
    const cards = [...root.querySelectorAll<HTMLElement>(".biz-card")];
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
    setMobileIndex(next);
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || !window.matchMedia("(max-width: 899px)").matches) return;

    const first = root.querySelector<HTMLElement>(".biz-card");
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

  return (
    <section className="biz" id="business">
      <div className="biz-mobile">
        <div className="biz-mobile-head">
          <h2>
            לא בטוחים איזה דגם?
            <br />
            תגידו לנו איזה עסק.
          </h2>
        </div>
        <div className="biz-track" ref={scrollerRef}>
          {businesses.map((item) => (
            <article key={item.name} className="biz-card">
              <div className="biz-card-media">
                {item.image ? (
                  <SiteImage src={item.image} alt={item.name} fit="cover" sizes="90vw" />
                ) : (
                  <ImageSlot placeholder={item.placeholder} />
                )}
                <div className="biz-card-shade" />
                <div className="biz-card-copy">
                  <div className="biz-card-name">{item.name}</div>
                  <p>{item.solutions}</p>
                  <Link href="/contact" className="btn btn-ghost-light">
                    קבלו התאמה לעסק
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="biz-dots" role="tablist" aria-label="סוגי עסקים">
          {businesses.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-label={item.name}
              aria-selected={mobileIndex === index}
              className={`biz-dot${mobileIndex === index ? " is-on" : ""}`}
              onClick={() => {
                const card = scrollerRef.current?.querySelectorAll<HTMLElement>(".biz-card")[index];
                if (card) alignCard(card);
              }}
            />
          ))}
        </div>
      </div>

      <div className="biz-desktop">
        <div className="biz-copy">
          <Reveal>
            <h2>
              לא בטוחים איזה דגם?
              <br />
              תגידו לנו איזה עסק.
            </h2>
          </Reveal>
          <div>
            {businesses.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={`biz-btn${active === index ? " is-on" : ""}${index === businesses.length - 1 ? " is-last" : ""}`}
                onClick={() => setActive(index)}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover: hover)").matches) setActive(index);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="biz-sol">
            <span style={{ fontSize: 13, color: "var(--mute)", width: "100%" }}>פתרונות מתאימים</span>
            <span style={{ fontSize: 15, fontWeight: 500 }}>{business.solutions}</span>
          </div>
          <Link href="/contact" className="btn btn-ink" style={{ alignSelf: "flex-start", marginTop: "clamp(22px,2.6vw,32px)" }}>
            קבלו התאמה לעסק
          </Link>
        </div>
        <div className="biz-media">
          {business.image ? (
            <SiteImage src={business.image} alt={business.name} fit="cover" sizes="55vw" />
          ) : (
            <ImageSlot placeholder={business.placeholder} />
          )}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              left: 0,
              padding: "16px clamp(16px,2vw,26px)",
              background: "linear-gradient(0deg,rgba(10,11,12,.8),transparent)",
              pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.82)" }}>{business.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
