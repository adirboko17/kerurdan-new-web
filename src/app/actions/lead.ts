"use server";

import { sendLeadEmail } from "@/lib/email";
import { parseIsraeliPhone } from "@/lib/phone";
import { insertWebsiteLead } from "@/lib/website-leads";

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
  const phone = parseIsraeliPhone(input.phone);

  if (!name) {
    return { ok: false as const, error: "missing" };
  }

  if (!phone) {
    return { ok: false as const, error: "phone" };
  }

  const email = trim(input.email, 120) || undefined;
  const city = trim(input.city, 60) || undefined;
  const business = trim(input.business, 80) || undefined;
  const businessType = trim(input.businessType, 60) || undefined;
  const topic = trim(input.topic, 60) || undefined;
  const message = trim(input.message, 2000) || undefined;

  if (input.source === "footer" || input.source === "contact") {
    const saved = await insertWebsiteLead(
      input.source === "footer"
        ? {
            source_area: "footer",
            name,
            phone,
            equipment_type: topic,
          }
        : {
            source_area: "contact",
            name,
            business_name: business,
            phone,
            email,
            business_type: businessType,
            equipment_type: topic,
            message,
          },
    );

    if (!saved.ok) {
      return { ok: false as const, error: saved.error };
    }
  }

  await sendLeadEmail({
    source:
      input.source === "footer" ? "פוטר" : input.source === "home" ? "דף הבית" : "צור קשר",
    name,
    phone,
    email,
    city,
    business,
    businessType,
    topic,
    message,
  });

  return { ok: true as const };
}
