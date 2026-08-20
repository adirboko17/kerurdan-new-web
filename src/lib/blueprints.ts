import type { Product } from "./types";

export type ProductBlueprint = {
  src: string;
  alt: string;
};

const BY_ID: Record<string, ProductBlueprint> = {
  "8dedae0e-72e8-48d0-8b38-6c4708ae35fc": {
    src: "/blueprints/upright-freezer-external-motor.png?raw=1",
    alt: "שרטוט מידות — מקפיא עומד מנוע חיצוני",
  },
};

export function getProductBlueprint(product: Pick<Product, "id" | "name" | "drawingUrl">) {
  if (product.drawingUrl) {
    return {
      src: product.drawingUrl,
      alt: `שרטוט מידות — ${product.name}`,
    };
  }
  return BY_ID[product.id] ?? null;
}
