"use client";

import { useEffect, useState } from "react";
import type { ProductBlueprint as Blueprint } from "@/lib/blueprints";
import { cropDrawingFromUrl } from "@/lib/cropDrawingWhitespace";

export function ProductBlueprint({ blueprint }: { blueprint: Blueprint }) {
  const [src, setSrc] = useState(blueprint.src);

  useEffect(() => {
    let cancelled = false;
    setSrc(blueprint.src);
    cropDrawingFromUrl(blueprint.src)
      .then((next) => {
        if (!cancelled) setSrc(next);
      })
      .catch(() => {
        if (!cancelled) setSrc(blueprint.src);
      });
    return () => {
      cancelled = true;
    };
  }, [blueprint.src]);

  return (
    <figure className="product-blueprint">
      <div className="product-blueprint-frame">
        {/* Cropped drawings use a data URL; keep a plain img so the real aspect ratio fills the column. */}
        <img src={src} alt={blueprint.alt} className="product-blueprint-img" />
      </div>
    </figure>
  );
}
