"use client";

import { productColorKey, useProductMedia } from "@/components/product/ProductMediaContext";
import type { ProductColor } from "@/lib/types";

function swatchBackground(color: ProductColor) {
  if (/נירוסטה|כסף|stainless|steel/i.test(color.name)) {
    return "linear-gradient(135deg,#f3f4f6 0%,#b8bdc3 38%,#eceff2 62%,#8d939a 100%)";
  }
  return color.hex;
}

function ColorSwatch({ color }: { color: ProductColor }) {
  return (
    <>
      <span
        className="product-color-dot"
        style={{ background: swatchBackground(color) }}
        aria-hidden="true"
      />
      <span className="product-color-name">{color.name}</span>
    </>
  );
}

export function ProductColors({ colors }: { colors: ProductColor[] }) {
  const media = useProductMedia();
  if (colors.length === 0) return null;

  return (
    <div className="product-colors">
      <span className="product-colors-label">המוצר קיים בצבעים</span>
      <ul className="product-colors-list">
        {colors.map((color) => {
          const key = productColorKey(color);
          const clickable = Boolean(color.imageUrl);
          const selected = clickable && media?.selectedKey === key;
          return (
            <li key={key}>
              {clickable ? (
                <button
                  type="button"
                  className={`product-color-chip${selected ? " is-selected" : ""}`}
                  onClick={() => media?.selectColor(color)}
                  aria-pressed={selected}
                >
                  <ColorSwatch color={color} />
                </button>
              ) : (
                <span className="product-color-chip is-static">
                  <ColorSwatch color={color} />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
