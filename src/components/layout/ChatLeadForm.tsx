"use client";

import { FormEvent, useState } from "react";
import { submitChatLead } from "@/app/actions/chat-lead";
import { PhoneField } from "@/components/ui/PhoneField";
import { parseIsraeliPhone } from "@/lib/phone";
import { SITE } from "@/lib/site";

export type ChatLeadItem = {
  slug: string;
  name: string;
  href: string;
  height: string | null;
  depth: string | null;
  width: string | null;
  volume: string | null;
};

function sizeLabel(item: ChatLeadItem) {
  if (item.height && item.depth && item.width) {
    return `גובה ${item.height} · עומק ${item.depth} · רוחב ${item.width} ס״מ`;
  }
  if (item.width) return `רוחב ${item.width} ס״מ`;
  return "";
}

function whatsappText(items: ChatLeadItem[], name = "", phone = "") {
  const lines = items.map((item) => {
    const size = sizeLabel(item);
    return size ? `- ${item.name} (${size})` : `- ${item.name}`;
  });
  return [
    "היי, הגעתי מהיועץ באתר קירור דן.",
    "אשמח להצעת מחיר עבור:",
    ...lines,
    name.trim() ? `שם: ${name.trim()}` : "",
    phone.trim() ? `טלפון: ${phone.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function ChatLeadForm({ items, open, onOpen }: { items: ChatLeadItem[]; open: boolean; onOpen: () => void }) {
  const [chosen, setChosen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((item) => [item.slug, true])),
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const selected = items.filter((item) => chosen[item.slug]);
  const whatsappHref = SITE.whatsappMessage(whatsappText(selected, sent ? name : "", sent ? phone : ""));

  function toggle(slug: string) {
    setChosen((current) => ({ ...current, [slug]: !current[slug] }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || sent) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!selected.length) {
      setError("בחרו לפחות דגם אחד.");
      return;
    }
    const parsedPhone = parseIsraeliPhone(phone);
    if (!name.trim() || !parsedPhone) {
      form.reportValidity();
      return;
    }

    setSending(true);
    setError("");
    const result = await submitChatLead({
      name,
      phone: parsedPhone,
      website: String(data.get("website") ?? ""),
      products: selected.map((item) => ({
        name: item.name,
        href: item.href,
        height: item.height,
        depth: item.depth,
        width: item.width,
        volume: item.volume,
      })),
    });
    setSending(false);
    if (!result.ok) {
      setError(result.error === "phone" ? "נא להזין מספר טלפון ישראלי תקין." : "לא הצלחנו לשלוח. נסו שוב או התקשרו.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="sales-chat-offer">
      <div className="sales-chat-actions">
        <button type="button" onClick={onOpen} aria-expanded={open}>
          אשמח להצעת מחיר
        </button>
        <a
          href={selected.length ? whatsappHref : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={selected.length ? undefined : true}
          onClick={(event) => {
            if (!selected.length) event.preventDefault();
          }}
        >
          וואטסאפ עם הדגמים
        </a>
      </div>

      {open ? (
        <form className="sales-chat-lead" onSubmit={onSubmit}>
          <label className="hp" aria-hidden="true">
            <span>אתר</span>
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>

          {sent ? (
            <p className="sales-chat-lead-done" role="status">
              קיבלנו את הפרטים. נחזור אליכם להצעת מחיר. אם נוח יותר, אפשר גם לשלוח את הדגמים בוואטסאפ.
            </p>
          ) : (
            <>
              <fieldset>
                <legend>הדגמים שיירשמו בפנייה</legend>
                {items.map((item) => (
                  <label key={item.slug} className="sales-chat-pick">
                    <input type="checkbox" checked={Boolean(chosen[item.slug])} onChange={() => toggle(item.slug)} />
                    <span>
                      <strong>{item.name}</strong>
                      {sizeLabel(item) ? <small>{sizeLabel(item)}</small> : null}
                    </span>
                  </label>
                ))}
              </fieldset>
              <label className="sales-chat-field">
                <span>שם מלא</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  placeholder="שם מלא"
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <PhoneField
                className="sales-chat-field"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                onBlur={(event) => {
                  const parsed = parseIsraeliPhone(event.currentTarget.value);
                  if (parsed) setPhone(parsed);
                }}
              />
              {error ? (
                <p className="sales-chat-error" role="alert">
                  {error}
                </p>
              ) : null}
              <button type="submit" disabled={sending || !selected.length}>
                {sending ? "שולחים..." : "שליחת פרטים"}
              </button>
            </>
          )}
        </form>
      ) : null}
    </div>
  );
}
