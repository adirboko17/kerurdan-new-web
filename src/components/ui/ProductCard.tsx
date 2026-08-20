"use client";

import Link from "next/link";
import type { ImageFit, Product } from "@/lib/types";
import { ImageSlot } from "./ImageSlot";
import { ProductPeek } from "./ProductPeek";
import { SiteImage } from "./SiteImage";

type ProductCardProps = {
  product: Product;
  showCategory?: boolean;
  note?: string;
  noteMono?: boolean;
  imageFit?: ImageFit;
};

export function ProductCard({
  product,
  showCategory = true,
  note,
  noteMono,
  imageFit,
}: ProductCardProps) {
  const image = product.images[0];

  return (
    <div className="product-card">
      <div className="product-card-media">
        <Link href={`/product/${product.slug}`} className="product-card-media-link" tabIndex={-1}>
          {image ? (
            <SiteImage src={image.src} alt={image.alt} fit={imageFit ?? image.fit} />
          ) : (
            <ImageSlot placeholder={product.name} />
          )}
        </Link>
        <ProductPeek product={product} />
      </div>
      <Link href={`/product/${product.slug}`} className="product-card-link">
        {showCategory ? (
          <div className="product-card-title">
            <span className="product-card-cat">{product.categoryName}</span>
            <span className="product-card-name">{product.name}</span>
          </div>
        ) : (
          <div className="product-card-name" style={{ paddingTop: 14 }}>
            {product.name}
          </div>
        )}
        {(note ?? product.note) && (
          <div
            className="product-card-note"
            style={
              noteMono
                ? { fontFamily: "'IBM Plex Mono', monospace", direction: "ltr", textAlign: "right" }
                : undefined
            }
          >
            {note ?? product.note}
          </div>
        )}
      </Link>
    </div>
  );
}
