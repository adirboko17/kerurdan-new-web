import fs from "fs";
import path from "path";
import type { CategorySlug } from "./types";

const GUIDES_DIR = path.join(process.cwd(), "content/guides");

export type GuideFaqItem = {
  question: string;
  answer: string;
};

export type GuideArticleMeta = {
  seoTitle: string;
  metaDescription: string;
  slug: string;
  targetKeyword?: string;
  h1: string;
  excerpt: string;
  faq: GuideFaqItem[];
  /** Markdown body without frontmatter (includes H1). */
  bodyMarkdown: string;
  datePublished: string;
};

export const GUIDE_DATE_PUBLISHED = "2026-10-25";

export const guidesByCategory: Record<CategorySlug, string[]> = {
  dairy: ["how-to-choose-dairy-fridge"],
  deli: ["deli-fridge-what-to-check"],
  freezers: ["upright-vs-chest-freezer-business"],
  refrigerators: [
    "minimarket-fridges-guide",
    "upright-display-fridge-drinks",
    "commercial-vs-industrial-fridge",
  ],
};

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    data[key] = value;
  }
  return { data, body: match[2] };
}

function extractH1(body: string): string {
  const line = body.split("\n").find((row) => row.startsWith("# "));
  return line ? line.replace(/^#\s+/, "").trim() : "";
}

function extractFaq(body: string): GuideFaqItem[] {
  const faqHeading = "## שאלות נפוצות";
  const start = body.indexOf(faqHeading);
  if (start === -1) return [];

  const afterHeading = body.slice(start + faqHeading.length);
  const nextSection = afterHeading.search(/\n## /);
  const section = nextSection === -1 ? afterHeading : afterHeading.slice(0, nextSection);

  const items: GuideFaqItem[] = [];
  const pattern = /\*\*([^*]+)\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n##|$)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(section)) !== null) {
    const question = match[1].trim();
    const answer = match[2].replace(/\n+/g, " ").trim();
    if (question && answer) items.push({ question, answer });
  }
  return items;
}

function parseGuideFile(fileName: string): GuideArticleMeta {
  const raw = fs.readFileSync(path.join(GUIDES_DIR, fileName), "utf8");
  const { data, body } = parseFrontmatter(raw);
  const h1 = extractH1(body);
  const metaDescription = data.meta_description ?? "";
  return {
    seoTitle: data.seo_title ?? h1,
    metaDescription,
    slug: data.slug ?? fileName.replace(/\.md$/, ""),
    targetKeyword: data.target_keyword,
    h1,
    excerpt: metaDescription,
    faq: extractFaq(body),
    bodyMarkdown: body.trim(),
    datePublished: GUIDE_DATE_PUBLISHED,
  };
}

let cachedGuides: GuideArticleMeta[] | null = null;

export function getAllGuides(): GuideArticleMeta[] {
  if (cachedGuides) return cachedGuides;
  const files = fs.readdirSync(GUIDES_DIR).filter((name) => name.endsWith(".md"));
  cachedGuides = files
    .sort((a, b) => a.localeCompare(b, "en"))
    .map(parseGuideFile);
  return cachedGuides;
}

export function getGuideBySlug(slug: string): GuideArticleMeta | undefined {
  return getAllGuides().find((guide) => guide.slug === slug);
}

export function getGuidesForCategory(category: CategorySlug): GuideArticleMeta[] {
  const slugs = guidesByCategory[category] ?? [];
  const all = getAllGuides();
  return slugs
    .map((guideSlug) => all.find((guide) => guide.slug === guideSlug))
    .filter((guide): guide is GuideArticleMeta => Boolean(guide));
}
