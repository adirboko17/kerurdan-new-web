"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  const phone = input.phone.trim();
  const city = input.city.trim();
  const productName = input.productName.trim();
  const productSlug = input.productSlug.trim();

  if (!name || !phone || !city || !productName) {
    return { ok: false as const, error: "missing" };
  }

  if (name.length > 80 || phone.length > 30 || city.length > 60) {
    return { ok: false as const, error: "invalid" };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("catalog_quote_requests").insert({
    customer_name: name,
    customer_phone: phone,
    customer_city: city,
    notes: `בקשה מעמוד מוצר: ${productName}`,
    items: [
      {
        type: "product",
        name: productName,
        slug: productSlug,
        id: input.productId ?? null,
      },
    ],
    status: "new",
  });

  if (error) {
    return { ok: false as const, error: "save" };
  }

  return { ok: true as const };
}
