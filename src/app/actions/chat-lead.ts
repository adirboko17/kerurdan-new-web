"use server";

import { sendLeadEmail } from "@/lib/email";
import { parseIsraeliPhone } from "@/lib/phone";
import { SITE } from "@/lib/site";
import { insertWebsiteLead } from "@/lib/website-leads";

export type ChatLeadProduct = {
  name: string;
  href: string;
  height?: string | null;
  depth?: string | null;
  width?: string | null;
  volume?: string | null;
};

export type ChatLeadInput = {
  name: string;
  phone: string;
  products: ChatLeadProduct[];
  website?: string;
};

function cleanMeasure(value: string | null | undefined) {
  const text = (value ?? "").trim();
  if (!/^\d+(?:\.\d+)?$/.test(text)) return null;
  return text;
}

function productLine(product: ChatLeadProduct) {
  const height = cleanMeasure(product.height);
  const depth = cleanMeasure(product.depth);
  const width = cleanMeasure(product.width);
  const volume = cleanMeasure(product.volume);
  const size =
    height && depth && width
      ? `גובה ${height} ס״מ, עומק ${depth} ס״מ, רוחב ${width} ס״מ${volume ? `, נפח ${volume} ל׳` : ""}`
      : "";
  const link = product.href.startsWith("/product/") ? `${SITE.url}${product.href}` : "";
  return [product.name, size, link].filter(Boolean).join("\n");
}

export async function submitChatLead(input: ChatLeadInput) {
  if (input.website?.trim()) return { ok: true as const };

  const name = input.name.trim().slice(0, 80);
  const phone = parseIsraeliPhone(input.phone);
  if (!name) return { ok: false as const, error: "missing" as const };
  if (!phone) return { ok: false as const, error: "phone" as const };

  const products = (input.products ?? []).slice(0, 3).flatMap((product) => {
    const title = product.name?.replace(/\s+/g, " ").trim().slice(0, 80);
    const href = product.href?.trim() ?? "";
    if (!title || !/^\/product\/[0-9a-f-]{36}$/i.test(href)) return [];
    return [
      {
        name: title,
        href,
        height: cleanMeasure(product.height),
        depth: cleanMeasure(product.depth),
        width: cleanMeasure(product.width),
        volume: cleanMeasure(product.volume),
      },
    ];
  });

  if (!products.length) return { ok: false as const, error: "products" as const };

  const details = products.map(productLine).join("\n\n");
  const names = products.map((product) => product.name).join(" · ").slice(0, 180);

  const saved = await insertWebsiteLead({
    source_area: "product",
    name,
    phone,
    equipment_type: names,
    product_context: details.slice(0, 1500),
    message: "ליד מיועץ הציוד באתר",
  });

  if (!saved.ok) return { ok: false as const, error: saved.error };

  await sendLeadEmail({
    source: "יועץ ציוד",
    name,
    phone,
    topic: names,
    productName: details,
    message: "הלקוח ביקש הצעת מחיר מהיועץ על הדגמים האלה.",
  });

  return { ok: true as const };
}
