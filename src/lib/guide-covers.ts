import { canonicalUrl } from "./metadata";

export type GuideCover = {
  /** Filename stem in /public/guides/ (dairy, deli, …) */
  file: string;
  alt: string;
};

export const GUIDE_COVERS: Record<string, GuideCover> = {
  "how-to-choose-dairy-fridge": {
    file: "dairy",
    alt: "חלבייה פתוחה לעסק – מקרר תצוגה למוצרי חלב ושתייה",
  },
  "minimarket-fridges-guide": {
    file: "minimarket",
    alt: "מקררים ומקפיאים במינימרקט – חלבייה, שתייה וקירור מסחרי",
  },
  "deli-fridge-what-to-check": {
    file: "deli",
    alt: "ויטרינת מעדנייה מעל דלפק – מקרר תצוגה לגבינות ונקניקים",
  },
  "commercial-vs-industrial-fridge": {
    file: "industrial",
    alt: "מקרר מסחרי ומקרר תעשייתי לעסק – ציוד קירור מקצועי",
  },
  "upright-display-fridge-drinks": {
    file: "drinks",
    alt: "מקרר תצוגה עומד לשתייה – דלתות זכוכית בחנות",
  },
  "upright-vs-chest-freezer-business": {
    file: "freezer",
    alt: "מקפיא עומד ומקפיא שוכב לעסק – קירור מסחרי",
  },
};

export function getGuideCover(slug: string): GuideCover | undefined {
  return GUIDE_COVERS[slug];
}

export function guideCoverJpgPath(slug: string): string | undefined {
  const cover = getGuideCover(slug);
  return cover ? `/guides/${cover.file}.jpg` : undefined;
}

export function guideCoverOgUrl(slug: string): string | undefined {
  const path = guideCoverJpgPath(slug);
  return path ? canonicalUrl(path) : undefined;
}
