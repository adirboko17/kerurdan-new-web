import { MEDIA } from "./site";
import type { Brand, BusinessSolution, Category, CategorySlug, Project } from "./types";

export const categories: Category[] = [
  {
    slug: "dairy",
    name: "חלביות",
    short: "חלב · שתייה · פירות וירקות",
    description:
      "תצוגה מקוררת לחלב, שתייה, פירות וירקות. קיימות בתצורת מנוע פנימי או חיצוני, עם דלתות הזזה, דלתות פתיחה או בתצורה פתוחה לגישה מהירה.",
    quote: "חלבייה עובדת מול תנועת לקוחות, לא מול מחסן.",
    context: [
      "הבחירה נקבעת לפי מה שמוצג, כמה פעמים ביום נפתחת הדלת ואיפה החלבייה עומדת ביחס למעבר. תצורה פתוחה מקצרת את זמן הלקיחה; דלתות זכוכית שומרות טוב יותר על הטמפרטורה.",
      "מנוע פנימי מתאים כשאין מקום ליחידה חיצונית. מנוע חיצוני מוריד רעש וחום מאזור המכירה, ודורש תכנון מראש של מיקום היחידה.",
    ],
    image: {
      src: `${MEDIA}/2025/02/${encodeURIComponent("מנוע-פנימי-הזזה")}-1.png`,
      alt: "חלבייה מנוע פנימי דלתות הזזה",
      fit: "contain",
    },
    catalogImage: {
      src: `${MEDIA}/2025/02/SD-2.png`,
      alt: "חלביות",
      fit: "contain",
    },
    placeholder: "צילום חלבייה",
    suitable: ["סופרמרקטים ומינימרקטים", "חנויות מזון ומכולות", "מעדניות", "בתי קפה"],
    ctaTitle: "רוצים לדעת איזו חלבייה מתאימה לחלל שלכם?",
    ctaText: "שלחו מידות ותמונה של המקום - נחזור עם תצורה מומלצת והצעת מחיר.",
  },
  {
    slug: "deli",
    name: "מעדניות",
    short: "תצוגה מעל דלפק",
    description:
      "ויטרינות תצוגה מעל דלפק לבשר, גבינות ומעדנים - במידות ובתצורות שונות, בהתאמה לעומק הדלפק ולגובה העבודה.",
    quote: "ויטרינה טובה נמדדת משני צדי הדלפק.",
    context: [
      "מצד הלקוח חשוב שהמוצר ייראה - גובה התצוגה, זווית הזכוכית והתאורה. מצד המוכר חשוב שיהיה נוח להגיע, למלא ולנקות בלי לעצור את העבודה.",
      "אורך הוויטרינה נקבע לפי מגוון המוצרים וקצב המכירה, והעומק לפי המקום שיש מאחורי הדלפק. אנחנו מודדים בשטח לפני שממליצים.",
    ],
    placeholder: "צילום ויטרינת מעדנייה",
    suitable: ["מעדניות", "קצביות", "סופרמרקטים ומינימרקטים"],
    ctaTitle: "מתכננים דלפק חדש?",
    ctaText: "שלחו מידות ותמונה של המקום - נחזור עם תצורה מומלצת והצעת מחיר.",
    onRequest: {
      title: "הדגמים מסופקים בהתאמה למידות",
      text: "מעדניות נבחרות לפי אורך הדלפק, סוג המוצר והמיקום בחנות. ספרו לנו על החלל ונחזור עם תצורה והצעת מחיר.",
    },
  },
  {
    slug: "refrigerators",
    name: "מקררים",
    short: "עומדים · תצוגה · שירות עצמי",
    description:
      "מקררי עומד מדלת אחת ועד ארבע דלתות, מקררי תצוגה ומקררי שירות עצמי. לתצוגה, למלאי עבודה ולאחסון קרוב לנקודת המכירה.",
    quote: "מספר הדלתות נגזר מקצב העבודה, לא מגודל החנות.",
    context: [
      "מקרר עומד עם יחידה פנימית לא דורש תכנון מיקום נוסף וניתן להזיז אותו בעזרת גלגלים. ככל שיש יותר פתיחות דלת ביום, אוויר מאולץ והפשרה אוטומטית נעשים קריטיים ליציבות הטמפרטורה.",
      "מקרר תצוגה ומקרר שירות עצמי נבחרים לפי מיקום ביחס לקופה ולתנועת הלקוחות. תאורת לד משנה מאוד את איך שהמוצר נראה על המדף.",
    ],
    image: {
      src: `${MEDIA}/2025/01/IMG-20250121-WA0025.jpg`,
      alt: "מקרר עומד 4 דלתות",
      fit: "cover",
    },
    catalogImage: {
      src: `${MEDIA}/2025/01/pool-1.png`,
      alt: "מקררים",
      fit: "contain",
    },
    heroFit: "cover",
    placeholder: "צילום מקרר",
    suitable: ["סופרמרקטים ומינימרקטים", "בתי קפה", "חנויות מזון ומכולות", "מעדניות"],
    ctaTitle: "כמה דלתות אתם באמת צריכים?",
    ctaText: "שלחו מידות ותמונה של המקום - נחזור עם תצורה מומלצת והצעת מחיר.",
  },
  {
    slug: "freezers",
    name: "מקפיאים תעשייתיים",
    short: "הקפאה ואחסון",
    description:
      "הקפאה ואחסון בטמפרטורות נמוכות לעסקים שעובדים עם מלאי קפוא - מארזי הקפאה, מקפיאי עומד ופתרונות אחסון בנפח.",
    quote: "מקפיא נמדד בזמן שהוא לא נפתח.",
    context: [
      "הקפאה יציבה תלויה באיטום, בבידוד ובכמות פתיחות הדלת ביום. ככל שהמלאי הקפוא גדול יותר, כדאי להפריד בין אחסון לבין תצוגה - כך לא מפשירים את כל הנפח בכל פתיחה.",
      "הבחירה נקבעת לפי כמות המלאי, תדירות ההזמנות והמקום שיש בעורף החנות. אנחנו בודקים גם חשמל ומעברי הובלה לפני שממליצים.",
    ],
    placeholder: "צילום מקפיא תעשייתי",
    suitable: ["קצביות", "חנויות מזון ומכולות", "בתי קפה"],
    ctaTitle: "צריכים יותר נפח הקפאה?",
    ctaText: "שלחו מידות ותמונה של המקום - נחזור עם תצורה מומלצת והצעת מחיר.",
    onRequest: {
      title: "הדגמים מסופקים בהתאמה לנפח",
      text: "מקפיאים נבחרים לפי כמות המלאי, סוג המוצר והמקום. ספרו לנו על החלל ונחזור עם תצורה והצעת מחיר.",
    },
  },
];


export const businesses: BusinessSolution[] = [
  {
    name: "סופרמרקטים ומינימרקטים",
    solutions: "חלביות · מקררים · מקפיאים תעשייתיים",
    needs:
      "תצוגה רציפה לאורך המעבר, מקררי שתייה בגישה מהירה, ואחסון קפוא לעבודה יומית. הציוד עובד שעות ארוכות ומול פתיחות דלת תכופות.",
    links: ["dairy", "refrigerators", "freezers"],
    placeholder: "סופרמרקט - מעבר מקוררים",
  },
  {
    name: "קצביות",
    solutions: "מעדניות · מקפיאים תעשייתיים",
    needs:
      "ויטרינת תצוגה מעל דלפק לבשר טרי, לצד הקפאה ואחסון בנפח לעבודה יומית. חשוב שהתצוגה תישאר יציבה גם כשהדלפק פתוח.",
    links: ["deli", "freezers"],
    placeholder: "קצבייה - ויטרינת בשר",
  },
  {
    name: "מעדניות",
    solutions: "מעדניות · חלביות · מקררים",
    needs:
      "תצוגה מעל דלפק לגבינות ומעדנים בגובה ובעומק שנוחים לעבודה משני צדי הדלפק, לצד מקרר עבודה לאחסון קרוב.",
    links: ["deli", "dairy", "refrigerators"],
    placeholder: "מעדנייה - דלפק גבינות",
  },
  {
    name: "חנויות מזון ומכולות",
    solutions: "חלביות · מקררים · מקפיאים תעשייתיים",
    needs:
      "שטח מוגבל וצורך במקסימום תצוגה. לרוב חלבייה אחת או שתיים, מקרר שתייה ליד הקופה, ומקפיא לפריטים בסיסיים.",
    links: ["dairy", "refrigerators", "freezers"],
    placeholder: "מכולת - מקררי שתייה",
  },
  {
    name: "בתי קפה",
    solutions: "מקררים · חלביות · מקפיאים תעשייתיים",
    needs: "ויטרינת מאפים וקינוחים באזור ההזמנה, מקרר עבודה מאחורי הבר, ואחסון קר קומפקטי למטבח.",
    links: ["refrigerators", "dairy", "freezers"],
    placeholder: "בית קפה - ויטרינת מאפים",
  },
];

export const projects: Project[] = [
  {
    title: "התקנת מערך קירור בסופרמרקט",
    text: "חלביות לאורך המעבר ומקררי שתייה - מתוכננים סביב תנועת הלקוחות בחנות.",
    equipment: "חלביות · מקררים",
    type: "מערך תצוגה ואחסון",
    placeholder: "פרויקט - סופרמרקט, לרוחב מלא",
  },
  {
    title: "ויטרינת מעדנייה",
    text: "תצוגה מעל דלפק לגבינות ומעדנים, בגובה ובעומק שמתאימים לעבודה מאחורי הדלפק.",
    equipment: "מעדניות",
    placeholder: "פרויקט - מעדנייה, לרוחב מלא",
  },
  {
    title: "מערך הקפאה לקצבייה",
    text: "מקפיאי עומד ושוכב לפי כמות המלאי, לצד ויטרינת תצוגה מעל הדלפק.",
    equipment: "מקפיאים · מעדניות",
    placeholder: "פרויקט - קצבייה, לרוחב מלא",
  },
];

export const processSteps = [
  { title: "אפיון", placeholder: "מדידה ואפיון בחלל הקיים", ratio: "4 / 5" },
  { title: "התאמה", placeholder: "בחירת תצורה ומידות", ratio: "1 / 1" },
  { title: "אספקה", placeholder: "הציוד לפני אספקה", ratio: "16 / 10" },
  { title: "התקנה", placeholder: "התקנה בשטח", ratio: "4 / 5" },
  { title: "שירות", placeholder: "החנות פועלת", ratio: "3 / 2" },
] as const;

export const brands: Brand[] = [
  { name: "ארומה", src: "/logos/aroma.webp" },
  { name: "עטרה", src: "/logos/atara.webp" },
  { name: "בנא", src: "/logos/bana.webp" },
  { name: "Defense", src: "/logos/defens.webp" },
  { name: "דוראלון", src: "/logos/doralon.webp" },
  { name: "פאטאל", src: "/logos/fatal.webp" },
  { name: "גנים", src: "/logos/ganim.webp" },
  { name: "גרעינים", src: "/logos/garinim.webp" },
  { name: "Hilton", src: "/logos/hilton.webp" },
  { name: "HOT", src: "/logos/hot.webp" },
  { name: "האגיס", src: "/logos/huggis.webp" },
  { name: "קמאדה", src: "/logos/kamada.webp" },
  { name: "לקט ישראל", src: "/logos/leket.webp" },
  { name: "מנטה", src: "/logos/menta.webp" },
  { name: "רולדין", src: "/logos/roladin.webp" },
  { name: "שוקית", src: "/logos/shukit.webp" },
  { name: "Starus", src: "/logos/starus.png" },
  { name: "סופר ספיר", src: "/logos/supersapir.webp" },
  { name: "טבע", src: "/logos/tevalogo.webp" },
  { name: "יין", src: "/logos/yain.webp" },
  { name: "YAMM", src: "/logos/yamm.webp" },
  { name: "Yellow", src: "/logos/yellow.webp" },
  { name: "זוגלובק", src: "/logos/zoglovek.webp" },
];

export const catalogFilters = [
  { id: 0, label: "הכל", slug: null },
  { id: 1, label: "חלביות", slug: "dairy" as const },
  { id: 2, label: "מקררים", slug: "refrigerators" as const },
  { id: 3, label: "מעדניות", slug: "deli" as const },
  { id: 4, label: "מקפיאים תעשייתיים", slug: "freezers" as const },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryName(slug: CategorySlug) {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}
