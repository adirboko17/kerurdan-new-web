"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product, SubcategoryFilter } from "@/lib/types";

type CategoryNote = {
  quote: string;
  text: [string, string];
};

type CategoryModelsProps = {
  products: Product[];
  subcategories: SubcategoryFilter[];
  note?: CategoryNote;
};

export function CategoryModels({ products, subcategories, note }: CategoryModelsProps) {
  const [active, setActive] = useState<string | null>(null);

  const items = useMemo(() => {
    if (!active) return products;
    return products.filter((product) => product.subcategorySlug === active);
  }, [active, products]);

  const showNote = Boolean(note && !active && items.length);
  const noteFirst = showNote && items.length < 6;

  return (
    <section className="section-pad" id="models">
      <div className="section-head">
        <h2>דגמים בקטגוריה</h2>
        <span style={{ fontSize: 13.5, color: "var(--mute)" }}>
          {items.length ? `${items.length} דגמים` : ""}
        </span>
      </div>

      {subcategories.length > 1 && (
        <div className="sub-tags" role="tablist" aria-label="סינון לפי תת-קטגוריה">
          <button
            type="button"
            className={`sub-tag${!active ? " is-on" : ""}`}
            onClick={() => setActive(null)}
          >
            הכל
          </button>
          {subcategories.map((item) => (
            <button
              key={item.slug}
              type="button"
              className={`sub-tag${active === item.slug ? " is-on" : ""}`}
              onClick={() => setActive(item.slug)}
            >
              {item.name}
              <span className="sub-tag-count">{item.count}</span>
            </button>
          ))}
        </div>
      )}

      {items.length ? (
        <div className="product-grid catalog-models-grid">
          {showNote && note && (
            <aside className={`catalog-note${noteFirst ? " is-first" : ""}`}>
              <p className="catalog-note-quote">{note.quote}</p>
              <p className="catalog-note-text">{note.text[0]}</p>
              <p className="catalog-note-text">{note.text[1]}</p>
            </aside>
          )}
          {items.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              showCategory={false}
              note={product.note}
            />
          ))}
        </div>
      ) : (
        <div className="pending-box" style={{ marginTop: 28 }}>
          <div style={{ fontSize: 15, color: "var(--mute)", fontWeight: 300 }}>
            אין דגמים בתת-הקטגוריה הזו.
          </div>
        </div>
      )}
    </section>
  );
}
