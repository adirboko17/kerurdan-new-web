"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

function nextIndex(current: number, length: number) {
  if (length < 2) return 0;
  let next = current;
  while (next === current) next = Math.floor(Math.random() * length);
  return next;
}

export function HomeFeatured({ products }: { products: Product[] }) {
  const usable = products.filter((product) => product.images[0]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const product = usable[index];

  if (!product) return null;

  return (
    <section
      className="featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Reveal className="featured-grid">
        <div className="featured-media">
          <div className="featured-shot">
            {usable.map((item, itemIndex) => (
              <Image
                key={item.id}
                src={item.images[0].src}
                alt={item.images[0].alt}
                fill
                sizes="(max-width: 900px) 100vw, 520px"
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
    </section>
  );
}
