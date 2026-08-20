import type { NavKey } from "./types";

export const SITE = {
  name: "קירור דן",
  description: "פתרונות קירור מסחריים ותעשייתיים - מהתכנון ועד ההתקנה.",
  url: "https://kerurdan.co.il",
  phoneDisplay: "058 677 6545",
  phoneUrgent: "058-6776545",
  phoneHref: "tel:+972586776545",
  whatsapp: "https://wa.me/972586776545",
  whatsappMessage(text: string) {
    return `https://wa.me/972586776545?text=${encodeURIComponent(text)}`;
  },
  address: "תוצרת הארץ 38, באר שבע",
  facebook: "https://www.facebook.com/kerurdan",
  instagram: "https://www.instagram.com/kerur_dan/",
  accent: "#1e5f87",
} as const;

export const NAV: { href: string; label: string; key: NavKey }[] = [
  { href: "/", label: "דף הבית", key: "home" },
  { href: "/catalog", label: "קטלוג", key: "catalog" },
  { href: "/about", label: "אודות", key: "about" },
  { href: "/contact", label: "צור קשר", key: "contact" },
];

export const MEDIA = "https://kerurdan.co.il/wp-content/uploads";
