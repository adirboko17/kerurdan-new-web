"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SiteImage } from "@/components/ui/SiteImage";
import type { Product } from "@/lib/types";

export function ProductGallery({ product }: { product: Product }) {
  const [shot, setShot] = useState(0);
  const current = product.images[shot] ?? product.images[0];

  return (
    <div>
      <div className="product-gallery-main">
        {current ? (
          <SiteImage
            src={current.src}
            alt={current.alt}
            fit={current.fit}
            padding={current.fit === "cover" ? "0" : "11%"}
            sizes="(max-width: 900px) 100vw, 55vw"
            priority
          />
        ) : (
          <ImageSlot placeholder={product.name} />
        )}
      </div>
      {product.images.length > 1 && (
        <div
          className="product-thumbs"
          style={{ gridTemplateColumns: `repeat(${Math.min(product.images.length, 4)}, minmax(0, 1fr))` }}
        >
          {product.images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className="product-thumb"
              aria-label={index === 0 ? "תצלום ראשי" : "תצלום נוסף"}
              onClick={() => setShot(index)}
              style={{
                opacity: shot === index ? 1 : 0.45,
                outline: shot === index ? "1.5px solid var(--ac)" : "none",
              }}
            >
              <Image src={image.src} alt="" fill sizes="120px" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
