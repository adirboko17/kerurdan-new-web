import type { Metadata } from "next";
import { HomeBusiness } from "@/components/home/HomeBusiness";
import { HomeCategories } from "@/components/home/HomeCategories";
import { HomeClosing, HomeCompany } from "@/components/home/HomeCompany";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProjects } from "@/components/home/HomeProjects";
import { HomeSelected } from "@/components/home/HomeSelected";
import { HomeStatement } from "@/components/home/HomeStatement";
import { PageShell } from "@/components/layout/PageShell";
import { getFeaturedProducts, getCatalogCategories, getSelectedProducts } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const revalidate = 120;

export const metadata: Metadata = {
  title: `${SITE.name} | הקור שמחזיק את העסק שלך`,
  description: SITE.description,
};

export default async function HomePage() {
  const [categories, featured, selected] = await Promise.all([
    getCatalogCategories(),
    getFeaturedProducts(),
    getSelectedProducts(),
  ]);

  return (
    <PageShell active="home" overlay>
      <HomeHero />
      <HomeStatement />
      <HomeCategories categories={categories} />
      <HomeFeatured products={featured} />
      <HomeProjects />
      <HomeCompany />
      <HomeBusiness />
      <HomeSelected products={selected} />
      <HomeClosing />
    </PageShell>
  );
}
