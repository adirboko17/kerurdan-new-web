export type NavKey = "home" | "catalog" | "solutions" | "projects" | "about" | "contact";

export type CategorySlug = "dairy" | "deli" | "refrigerators" | "freezers";

export type ImageFit = "contain" | "cover";

export type SiteImageData = {
  src: string;
  alt: string;
  fit?: ImageFit;
};

export type SpecRow = {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
};

export type SizeVariant = {
  code: string | null;
  width: string | null;
  depth: string | null;
  height: string | null;
  volume: string | null;
  modelName: string | null;
  dims: string;
};

export type SubcategoryFilter = {
  slug: string;
  name: string;
  count: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  categoryName: string;
  subcategorySlug: string | null;
  subcategoryName: string | null;
  note: string;
  eyebrow: string;
  description: string;
  images: SiteImageData[];
  highlights: SpecRow[];
  specs: SpecRow[];
  sizeVariants: SizeVariant[];
  suitable: string[];
  related: string[];
  features: string[];
};

export type Category = {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
  quote: string;
  context: [string, string];
  image?: SiteImageData;
  catalogImage?: SiteImageData;
  heroFit?: ImageFit;
  placeholder: string;
  suitable: string[];
  ctaTitle: string;
  ctaText: string;
  onRequest?: {
    title: string;
    text: string;
  };
};

export type BusinessSolution = {
  name: string;
  solutions: string;
  needs: string;
  links: CategorySlug[];
  image?: string;
  placeholder: string;
};

export type Project = {
  title: string;
  text: string;
  equipment: string;
  type?: string;
  client?: string;
  location?: string;
  image?: string;
  placeholder: string;
};

export type Brand = {
  name: string;
  src: string;
};
