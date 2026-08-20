import type { ReactNode } from "react";
import { getFeaturedProducts } from "@/lib/catalog";
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
  const featured = await getFeaturedProducts();

  return (
    <div className={`page${dark ? " page-dark" : ""}${overlay ? "" : " is-inner"}`}>
      <Header active={active} overlay={overlay} featured={featured} />
      {!overlay && <div className="header-spacer" />}
      {children}
      <Footer showContact={active !== "contact"} />
    </div>
  );
}
