"use server";

import { sendLeadEmail } from "@/lib/email";

export type LeadInput = {
  source: "contact" | "footer" | "home";
  name: string;
  phone: string;
  email?: string;
  city?: string;
  business?: string;
  businessType?: string;
  topic?: string;
  message?: string;
  website?: string;
};

function trim(value: string | undefined, max: number) {
  return (value ?? "").trim().slice(0, max);
}

export async function submitLead(input: LeadInput) {
  if (input.website?.trim()) {
    return { ok: true as const };
  }

  const name = trim(input.name, 80);
  const phone = trim(input.phone, 30);

  if (!name || !phone) {
    return { ok: false as const, error: "missing" };
  }

  const result = await sendLeadEmail({
    source:
      input.source === "footer" ? "פוטר" : input.source === "home" ? "דף הבית" : "צור קשר",
    name,
    phone,
    email: trim(input.email, 120) || undefined,
    city: trim(input.city, 60) || undefined,
    business: trim(input.business, 80) || undefined,
    businessType: trim(input.businessType, 60) || undefined,
    topic: trim(input.topic, 60) || undefined,
    message: trim(input.message, 2000) || undefined,
  });

  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }

  return { ok: true as const };
}
