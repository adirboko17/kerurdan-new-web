import { getCatalog } from "@/lib/catalog";
import { getAllGuides } from "@/lib/guides";
import { SITE } from "@/lib/site";

function link(path: string, label: string, note?: string) {
  const href = `${SITE.url}${path}`;
  return note ? `- [${label}](${href}): ${note}` : `- [${label}](${href})`;
}

export async function buildLlmsTxt() {
  const { categories } = await getCatalog();
  const guides = getAllGuides();

  return `# ${SITE.name}

> קירור דן – מעל 30 שנה בענף הקירור. ייבוא, שיווק, אספקה והתקנה של ציוד קירור מסחרי ותעשייתי לעסקים ברחבי הארץ: חלביות, מעדניות, מקררים ומקפיאים.

## מה אנחנו מספקים

${categories
  .map((category) =>
    link(`/catalog/${category.slug}`, category.name, category.short || category.description),
  )
  .join("\n")}

## דפים מרכזיים

${link("/", "דף הבית", "סקירה, קטגוריות ודגמים נבחרים")}
${link("/catalog", "קטלוג", "כל הדגמים לפי משפחות ציוד")}
${link("/about", "אודות", "מי אנחנו ולמי אנחנו מספקים")}
${link("/contact", "צור קשר", "השארת פרטים להצעת מחיר")}
${link("/projects", "פרויקטים", "עבודות והתקנות")}
${link("/solutions", "פתרונות לעסקים", "התאמת ציוד לפי סוג עסק")}
${link("/guides", "מאמרים ומדריכים", "מדריכים לבחירת ציוד קירור לעסק")}

## מאמרים ומדריכים

${guides.map((guide) => link(`/guides/${guide.slug}`, guide.h1, guide.excerpt)).join("\n")}

## יצירת קשר

- טלפון: ${SITE.phoneUrgent} (${SITE.phoneDisplay})
- וואטסאפ: ${SITE.whatsapp}
- כתובת: ${SITE.address}
- אתר: ${SITE.url}
- שירות: אספקה, התקנה וליווי לעסקים בכל הארץ

## קבצים נוספים

${link("/llms-full.txt", "llms-full.txt", "רשימת דגמים וקישורים")}
${link("/sitemap.xml", "sitemap.xml", "מפת אתר")}
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
