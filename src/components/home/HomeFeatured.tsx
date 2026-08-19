"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

export function HomeFeatured({ product }: { product: Product | null }) {
  const [shot, setShot] = useState(0);

  if (!product || !product.images[0]) return null;

  return (
    <section className="featured">
      <Reveal className="featured-grid">
        <div className="featured-media">
          <div className="featured-shot">
            {product.images.map((image, index) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                  fill
                  sizes="420px"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    opacity: shot === index ? 1 : 0,
                    transition: "opacity .55s ease",
                  }}
              />
            ))}
          </div>
          {product.images.length > 1 && (
            <div className="thumbs">
              {product.images.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={`thumb${shot === index ? " is-on" : ""}`}
                  aria-label={`תצלום ${index + 1}`}
                  onClick={() => setShot(index)}
                >
                  <Image src={image.src} alt="" fill sizes="72px" style={{ objectFit: "contain", padding: 4 }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="featured-copy">
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
    </section>
  );
}
