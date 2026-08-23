import { getCatalog } from "@/lib/catalog";
import { SITE } from "@/lib/site";

function link(path: string, label: string, note?: string) {
  const href = `${SITE.url}${path}`;
  return note ? `- [${label}](${href}): ${note}` : `- [${label}](${href})`;
}

export async function buildLlmsTxt() {
  const { categories } = await getCatalog();

  return `# ${SITE.name}

> ייבוא ושיווק ציוד קירור מסחרי ותעשייתי לעסקים בישראל. חלביות, מעדניות, מקררים ומקפיאים - מותאמים לסופרמרקטים, מעדניות, קצביות, מכולות ובתי קפה.

${SITE.name} (Kerur Dan) is based in Beersheba and supplies commercial refrigeration equipment across Israel: dairy display cases, deli counters, upright refrigerators, and industrial freezers. Quotes are tailored to the store layout and daily use.

## Pages

${link("/", "דף הבית", "סקירה, קטגוריות ודגמים נבחרים")}
${link("/catalog", "קטלוג", "כל הדגמים לפי משפחות ציוד")}
${link("/about", "אודות", "מי אנחנו ולמי אנחנו מספקים")}
${link("/contact", "צור קשר", "השארת פרטים להצעת מחיר")}
${link("/projects", "פרויקטים", "עבודות והתקנות")}
${link("/solutions", "פתרונות לעסקים", "התאמת ציוד לפי סוג עסק")}

## Catalog

${categories
  .map((category) =>
    link(`/catalog/${category.slug}`, category.name, category.short || category.description),
  )
  .join("\n")}

## Contact

- Phone: ${SITE.phoneUrgent}
- WhatsApp: ${SITE.whatsapp}
- Email: dani@kerurdan.co.il
- Address: ${SITE.address}
- Website: ${SITE.url}

## Optional

${link("/llms-full.txt", "llms-full.txt", "רשימה מלאה של דגמים וקישורים")}
${link("/sitemap.xml", "sitemap.xml", "מפת אתר למנועי חיפוש")}
${link("/privacy", "מדיניות פרטיות")}
${link("/accessibility", "הצהרת נגישות")}
`;
}

export async function buildLlmsFullTxt() {
  const { categories, products } = await getCatalog();
  const intro = await buildLlmsTxt();

  const byCategory = categories
    .map((category) => {
      const items = products.filter((product) => product.category === category.slug && product.images[0]);
      if (!items.length) return "";
      const lines = items.map((product) => {
        const note = [product.subcategoryName, product.note].filter(Boolean).join(" · ");
        return link(`/product/${product.slug}`, product.name, note || undefined);
      });
      return `## ${category.name}\n\n${lines.join("\n")}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return `${intro.trim()}

# Full catalog

${byCategory}
`;
}
