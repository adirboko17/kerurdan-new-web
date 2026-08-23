"use server";

import { sendLeadEmail } from "@/lib/email";
import { parseIsraeliPhone } from "@/lib/phone";
import { insertWebsiteLead } from "@/lib/website-leads";

export type QuoteRequestInput = {
  name: string;
  phone: string;
  city: string;
  productName: string;
  productSlug: string;
  productId?: string;
};

export async function submitProductQuote(input: QuoteRequestInput) {
  const name = input.name.trim();
  const phone = parseIsraeliPhone(input.phone);
  const city = input.city.trim();
  const productName = input.productName.trim();

  if (!name || !city || !productName) {
    return { ok: false as const, error: "missing" };
  }

  if (!phone) {
    return { ok: false as const, error: "phone" };
  }

  if (name.length > 80 || city.length > 60) {
    return { ok: false as const, error: "invalid" };
  }

  const saved = await insertWebsiteLead({
    source_area: "product",
    name,
    phone,
    city,
    product_context: productName,
  });

  if (!saved.ok) {
    return { ok: false as const, error: saved.error };
  }

  await sendLeadEmail({
    source: "עמוד מוצר",
    name,
    phone,
    city,
    productName,
  });

  return { ok: true as const };
}
