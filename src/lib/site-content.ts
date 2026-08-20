import { cache } from "react";
import { brands as fallbackBrands, projects as fallbackProjects } from "./data";
import { createSupabaseServerClient } from "./supabase/server";
import type { Brand, Project } from "./types";

type CategoryRef = { id: string; name: string } | { id: string; name: string }[] | null;

type ProjectImageRow = {
  id: string;
  image_url: string;
  sort_order: number | null;
};

type ProjectRow = {
  id: string;
  title: string;
  region: string | null;
  customer_name: string | null;
  sort_order: number | null;
  categories: CategoryRef;
  site_project_images: ProjectImageRow[] | null;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export const getSiteProjects = cache(async (): Promise<Project[]> => {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_projects")
      .select(
        `
        id, title, region, customer_name, sort_order, category_id,
        categories ( id, name ),
        site_project_images ( id, image_url, sort_order )
      `,
      )
      .eq("show_on_website", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const rows = (data ?? []) as ProjectRow[];
    if (rows.length === 0) return fallbackProjects;

    return rows.map((row) => {
      const category = one(row.categories);
      const images = (row.site_project_images ?? [])
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((image) => image.image_url)
        .filter(Boolean);

      return {
        id: row.id,
        title: row.title,
        text: "",
        equipment: category?.name ?? "",
        client: row.customer_name ?? undefined,
        location: row.region ?? undefined,
        image: images[0],
        images,
        placeholder: row.title,
      };
    });
  } catch (error) {
    console.error("Failed to load site projects from Supabase", error);
    return fallbackProjects;
  }
});

export const getPartnerLogos = cache(async (): Promise<Brand[]> => {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("partner_logos")
      .select("id, company_name, logo_url, sort_order")
      .eq("show_on_website", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const logos = (data ?? [])
      .filter((row) => row.logo_url)
      .map((row) => ({
        name: row.company_name,
        src: row.logo_url,
      }));

    return logos.length > 0 ? logos : fallbackBrands;
  } catch (error) {
    console.error("Failed to load partner logos from Supabase", error);
    return fallbackBrands;
  }
});
