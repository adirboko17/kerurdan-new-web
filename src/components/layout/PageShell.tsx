import type { ReactNode } from "react";
import { getCatalogProducts, getFeaturedProducts } from "@/lib/catalog";
import { toSearchItems } from "@/lib/search";
import type { NavKey } from "@/lib/types";
import { Footer } from "./Footer";
import { Header } from "./Header";

type PageShellProps = {
  children: ReactNode;
  active?: NavKey;
  overlay?: boolean;
  dark?: boolean;
};

export async function PageShell({ children, active, overlay = false, dark = false }: PageShellProps) {
  const [featured, products] = await Promise.all([getFeaturedProducts(), getCatalogProducts()]);

  return (
    <div className={`page${dark ? " page-dark" : ""}${overlay ? " is-home" : " is-inner"}`}>
      <Header active={active} overlay={overlay} featured={featured} searchItems={toSearchItems(products)} />
      {!overlay && <div className="header-spacer" />}
      {children}
      <Footer showContact={active !== "contact"} />
    </div>
  );
}
