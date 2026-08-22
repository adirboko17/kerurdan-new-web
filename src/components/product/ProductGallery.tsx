"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProductMedia } from "@/components/product/ProductMediaContext";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SiteImage } from "@/components/ui/SiteImage";
import type { Product, SiteImageData } from "@/lib/types";

function uniqueImages(product: Product): SiteImageData[] {
  const seen = new Set<string>();
  const images: SiteImageData[] = [];

  for (const image of product.images) {
    if (!image.src || seen.has(image.src)) continue;
    seen.add(image.src);
    images.push(image);
  }

  for (const color of product.colors) {
    if (!color.imageUrl || seen.has(color.imageUrl)) continue;
    seen.add(color.imageUrl);
    images.push({
      src: color.imageUrl,
      alt: `${product.name} ${color.name}`,
      fit: "contain",
    });
  }

  return images;
}

export function ProductGallery({ product }: { product: Product }) {
  const media = useProductMedia();
  const [shot, setShot] = useState(0);
  const [fromThumb, setFromThumb] = useState(false);
  const stack = useMemo(() => uniqueImages(product), [product]);
  const loaded = useRef(new Set<string>());
  const [visibleSrc, setVisibleSrc] = useState(stack[0]?.src ?? null);

  useEffect(() => {
    setFromThumb(false);
  }, [media?.selectedKey]);

  const colorImage = !fromThumb && media?.activeImageSrc
    ? { src: media.activeImageSrc, alt: product.name, fit: "contain" as const }
    : null;
  const current = colorImage ?? product.images[shot] ?? stack[0] ?? null;
  const currentSrc = current?.src ?? null;

  useEffect(() => {
    if (currentSrc && loaded.current.has(currentSrc)) {
      setVisibleSrc(currentSrc);
    }
  }, [currentSrc]);

  function markLoaded(src: string) {
    loaded.current.add(src);
    if (src === currentSrc) setVisibleSrc(src);
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        {stack.length > 0 ? (
          stack.map((image, index) => (
            <div
              key={image.src}
              className={`product-gallery-shot${image.src === visibleSrc ? " is-active" : ""}`}
            >
              <SiteImage
                src={image.src}
                alt={image.alt}
                fit={image.fit}
                padding={image.fit === "cover" ? "0" : "6%"}
                sizes="(max-width: 900px) 100vw, 560px"
                priority={index === 0}
                eager={index > 0}
                onLoad={() => markLoaded(image.src)}
              />
            </div>
          ))
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
              onClick={() => {
                setShot(index);
                setFromThumb(true);
              }}
              style={{
                opacity: !fromThumb && media?.activeImageSrc ? 0.45 : shot === index ? 1 : 0.45,
                outline: !fromThumb && media?.activeImageSrc ? "none" : shot === index ? "1.5px solid var(--ac)" : "none",
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
