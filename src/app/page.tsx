import type { Metadata, Viewport } from "next";
import { HomeBusiness } from "@/components/home/HomeBusiness";
import { HomeCategories } from "@/components/home/HomeCategories";
import { HomeClosing } from "@/components/home/HomeCompany";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProjects } from "@/components/home/HomeProjects";
import { HomeSelected } from "@/components/home/HomeSelected";
import { HomeStatement } from "@/components/home/HomeStatement";
import { PageShell } from "@/components/layout/PageShell";
import { getFeaturedProducts, getCatalogCategories, getSelectedProducts } from "@/lib/catalog";
import { getSiteProjects } from "@/lib/site-content";
import { SITE } from "@/lib/site";

export const revalidate = 120;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#e4ecf0",
};

export const metadata: Metadata = {
  title: `${SITE.name} | הקור שמחזיק את העסק שלך`,
  description: SITE.description,
};

export default async function HomePage() {
  const [categories, featured, selected, projects] = await Promise.all([
    getCatalogCategories(),
    getFeaturedProducts(),
    getSelectedProducts(),
    getSiteProjects(),
  ]);

  return (
    <PageShell active="home" overlay>
      <HomeHero />
      <HomeStatement />
      <div className="home-catalog-stack">
        <HomeCategories categories={categories} />
        <HomeFeatured products={featured} />
      </div>
      <HomeProjects projects={projects.slice(0, 4)} />
      <div className="home-bottom-stack">
        <HomeBusiness />
        <HomeSelected products={selected} />
      </div>
      <HomeClosing />
    </PageShell>
  );
}
