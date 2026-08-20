import type { Product } from "./types";

export type ProductBlueprint = {
  src: string;
  alt: string;
};

const BY_ID: Record<string, ProductBlueprint> = {
  "0b0d82a3-ba2e-4b65-b605-f42b369b3c53": {
    src: "/blueprints/upright-freezer-external-motor.png?raw=1",
    alt: "שרטוט מידות — מקפיא עומד מנוע חיצוני",
  },
};

export function getProductBlueprint(product: Pick<Product, "id" | "name">) {
  return BY_ID[product.id] ?? null;
}
