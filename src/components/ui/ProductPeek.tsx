"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProductQuoteButton } from "@/components/product/ProductQuoteButton";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SiteImage } from "@/components/ui/SiteImage";
import type { Product } from "@/lib/types";

type ProductPeekProps = {
  product: Product;
};

export function ProductPeek({ product }: ProductPeekProps) {
  const titleId = useId();
  const startY = useRef(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setDrag(0);
        setDragging(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setDrag(0);
    setDragging(false);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    startY.current = event.clientY;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDrag(Math.max(0, event.clientY - startY.current));
  }

  function onPointerUp() {
    if (!dragging) return;
    if (drag > 90) close();
    else {
      setDrag(0);
      setDragging(false);
    }
  }

  const image = product.images[0];

  return (
    <>
      <button
        type="button"
        className="product-card-peek"
        aria-label={`הצצה ב${product.name}`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 5.5c5.2 0 9.4 4.1 10.4 6.2-.9 1.9-4.9 6.3-10.4 6.3S2.5 13.6 1.6 11.7C2.6 9.6 6.8 5.5 12 5.5Zm0 2C8.2 7.5 5.1 10 4 11.7c.9 1.4 3.8 3.8 8 3.8s7.1-2.4 8-3.8C18.9 10 15.8 7.5 12 7.5Zm0 1.6a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2Z"
          />
        </svg>
      </button>

      {mounted && open
        ? createPortal(
            <div className="product-peek" role="dialog" aria-modal="true" aria-labelledby={titleId}>
              <button type="button" className="product-peek-backdrop" aria-label="סגירה" onClick={close} />
              <div
                className={`product-peek-sheet${dragging ? " is-dragging" : ""}`}
                style={{ transform: drag ? `translateY(${drag}px)` : undefined }}
              >
                <div
                  className="product-peek-handle"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  <span />
                </div>
                <div className="product-peek-body">
                  <div className="product-peek-media">
                    {image ? (
                      <SiteImage src={image.src} alt={image.alt} fit={image.fit ?? "contain"} padding="8%" />
                    ) : (
                      <ImageSlot placeholder={product.name} />
                    )}
                  </div>
                  <div className="product-peek-copy">
                    <div className="product-peek-kicker">
                      {product.categoryName}
                      {product.subcategoryName ? ` · ${product.subcategoryName}` : ""}
                    </div>
                    <h2 id={titleId}>{product.name}</h2>
                    {product.description ? <p>{product.description}</p> : null}
                    {product.highlights.length > 0 && (
                      <div className="stat-grid">
                        {product.highlights.slice(0, 3).map((item) => (
                          <div className="stat" key={item.label}>
                            <div
                              className="stat-value"
                              style={{
                                color: item.accent ? "var(--ac)" : undefined,
                                fontFamily: item.mono ? "'IBM Plex Mono', monospace" : undefined,
                              }}
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
                        {product.features.slice(0, 8).map((feature) => (
                          <span key={feature}>{feature}</span>
                        ))}
                      </div>
                    )}
                    {product.specs.length > 0 && (
                      <dl className="product-peek-specs">
                        {product.specs.slice(0, 8).map((row) => (
                          <div key={row.label}>
                            <dt>{row.label}</dt>
                            <dd
                              style={{
                                color: row.accent ? "var(--ac)" : undefined,
                                fontFamily: row.mono ? "'IBM Plex Mono', monospace" : undefined,
                              }}
                            >
                              {row.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <div className="product-peek-actions">
                      <ProductQuoteButton
                        productName={product.name}
                        productSlug={product.slug}
                        productId={product.id}
                      />
                      <Link href={`/product/${product.slug}`} className="btn btn-ghost-dark" onClick={close}>
                        לפרטי המוצר
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
