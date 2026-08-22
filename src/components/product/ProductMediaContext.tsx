"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ProductColor } from "@/lib/types";

export function productColorKey(color: ProductColor) {
  return `${color.name}::${color.hex}`;
}

type ProductMediaValue = {
  selectedKey: string | null;
  activeImageSrc: string | null;
  selectColor: (color: ProductColor) => void;
};

const ProductMediaContext = createContext<ProductMediaValue | null>(null);

export function ProductMediaProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ProductColor | null>(null);

  const value = useMemo<ProductMediaValue>(
    () => ({
      selectedKey: selected ? productColorKey(selected) : null,
      activeImageSrc: selected?.imageUrl ?? null,
      selectColor: setSelected,
    }),
    [selected],
  );

  return <ProductMediaContext.Provider value={value}>{children}</ProductMediaContext.Provider>;
}

export function useProductMedia() {
  return useContext(ProductMediaContext);
}
