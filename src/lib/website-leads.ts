import { createSupabaseServerClient } from "@/lib/supabase/server";

export type WebsiteLeadSource = "footer" | "contact" | "product";

export type WebsiteLeadInsert = {
  source_area: WebsiteLeadSource;
  name: string;
  phone?: string;
  city?: string;
  business_name?: string;
  email?: string;
  business_type?: string;
  equipment_type?: string;
  message?: string;
  product_context?: string;
};

function optional(value: string | undefined) {
  const next = value?.trim();
  return next ? next : undefined;
}

export async function insertWebsiteLead(input: WebsiteLeadInsert) {
  const name = input.name.trim();
  if (!name) return { ok: false as const, error: "missing" };

  const row = {
    source_area: input.source_area,
    name,
    status: "new" as const,
    phone: optional(input.phone),
    city: optional(input.city),
    business_name: optional(input.business_name),
    email: optional(input.email),
    business_type: optional(input.business_type),
    equipment_type: optional(input.equipment_type),
    message: optional(input.message),
    product_context: optional(input.product_context),
  };

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("website_leads").insert(row);

  if (error) {
    console.error("website_leads insert failed", error);
    return { ok: false as const, error: "save" };
  }

  return { ok: true as const };
}
