"use client";

import Link from "next/link";
import { useState } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { businesses, getCategoryName } from "@/lib/data";

export function SolutionsPicker() {
  const [active, setActive] = useState(0);
  const business = businesses[active];

  return (
    <section>
      <div className="sol-grid">
        <div className="biz-copy" style={{ padding: "clamp(34px,4.5vw,80px) var(--pad-x)" }}>
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
          <div
            style={{
              marginTop: "clamp(26px,3vw,40px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))",
              gap: "clamp(18px,2.4vw,40px)",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "var(--mute)", marginBottom: 12 }}>מה בדרך כלל נדרש</div>
              <div style={{ fontSize: 15.5, lineHeight: 1.75, fontWeight: 300, color: "#3A4145" }}>{business.needs}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--mute)", marginBottom: 12 }}>פתרונות רלוונטיים</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 15.5, fontWeight: 500 }}>
                {business.links.map((slug) => (
                  <Link key={slug} href={`/catalog/${slug}`} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>{getCategoryName(slug)}</span>
                    <span style={{ opacity: 0.35 }}>←</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/contact" className="btn btn-ink" style={{ alignSelf: "flex-start", marginTop: "clamp(24px,3vw,38px)" }}>
            קבלו התאמה לעסק
          </Link>
        </div>
        <div className="biz-media" style={{ minHeight: "clamp(300px,60vh,680px)" }}>
          <ImageSlot placeholder={business.placeholder} />
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
