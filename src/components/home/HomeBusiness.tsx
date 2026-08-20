"use client";

import Link from "next/link";
import { useState } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { businesses } from "@/lib/data";

export function HomeBusiness() {
  const [active, setActive] = useState(0);
  const business = businesses[active];

  return (
    <section className="biz" id="business">
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
              onMouseEnter={() => setActive(index)}
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
          <SiteImage src={business.image} alt={business.name} fit="cover" sizes="(max-width: 900px) 100vw, 55vw" />
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
    </section>
  );
}
