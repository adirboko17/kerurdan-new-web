import type { CategorySlug } from "./types";
import { guidesByCategory } from "./guides";

const SKIP_BODY_HEADING =
  /^(שאלות נפוצות|רוצים|צריכים|פותחים|לא בטוחים|מאמרים)/;

export function extractShortAnswer(body: string): string | null {
  const match = body.match(/\*\*תשובה קצרה:\*\*\s*([\s\S]+?)(?=\n\n)/);
  return match ? match[1].trim() : null;
}

export function estimateReadingMinutes(body: string): number {
  const text = body.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[#*|_\[\]()]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

/** Body markdown for rendering: no H1, no short-answer paragraph, no FAQ / trailing contact sections. */
export function markdownForArticleBody(body: string): string {
  const lines = body.split("\n");
  const out: string[] = [];
  let i = 0;
  let skippingSection = false;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      i += 1;
      continue;
    }

    if (line.includes("**תשובה קצרה:**")) {
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const heading = line.slice(3).trim();
      if (SKIP_BODY_HEADING.test(heading)) {
        skippingSection = true;
        i += 1;
        continue;
      }
      skippingSection = false;
    }

    if (skippingSection) {
      i += 1;
      continue;
    }

    out.push(line);
    i += 1;
  }

  return out.join("\n").trim();
}

export function getGuideCategorySlugs(slug: string): CategorySlug[] {
  const slugs: CategorySlug[] = [];
  for (const [category, guideSlugs] of Object.entries(guidesByCategory) as [CategorySlug, string[]][]) {
    if (guideSlugs.includes(slug)) slugs.push(category);
  }
  return slugs;
}

export function extractProductSlugsFromBody(body: string): string[] {
  const found = new Set<string>();
  const pattern = /\/product\/([0-9a-f-]{36})/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(body)) !== null) {
    found.add(match[1].toLowerCase());
  }
  return [...found];
}
