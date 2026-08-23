import { Resend } from "resend";

export type LeadEmail = {
  source: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  business?: string;
  businessType?: string;
  topic?: string;
  message?: string;
  productName?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rows(lead: LeadEmail) {
  return [
    ["מקור", lead.source],
    ["שם", lead.name],
    ["טלפון", lead.phone],
    ["אימייל", lead.email],
    ["עיר", lead.city],
    ["עסק", lead.business],
    ["סוג עסק", lead.businessType],
    ["סוג ציוד", lead.topic],
    ["מוצר", lead.productName],
    ["הודעה", lead.message],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()));
}

export async function sendLeadEmail(lead: LeadEmail) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false as const, error: "config" };

  const from = process.env.RESEND_FROM?.trim() || "קירור דן <leads@kerurdan.co.il>";
  const to = process.env.RESEND_TO?.trim() || "dani@kerurdan.co.il";
  const fields = rows(lead);
  const text = fields.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#111;direction:rtl;text-align:right">
      <h2 style="margin:0 0 16px">ליד חדש מהאתר</h2>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        ${fields
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;width:120px">${escapeHtml(label)}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    ...(lead.email ? { replyTo: lead.email } : {}),
    subject: `ליד חדש מהאתר — ${lead.name}`,
    html,
    text,
  });

  if (error) {
    console.error("Resend lead email failed", error);
    return { ok: false as const, error: "send" };
  }

  return { ok: true as const };
}
