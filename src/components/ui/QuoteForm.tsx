"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { submitLead } from "@/app/actions/lead";
import { PhoneField } from "@/components/ui/PhoneField";
import { parseIsraeliPhone } from "@/lib/phone";
import { SITE } from "@/lib/site";

type QuoteFormProps = {
  compact?: boolean;
  light?: boolean;
};

function Honeypot() {
  return (
    <label className="hp" aria-hidden="true">
      <span>אתר</span>
      <input name="website" type="text" tabIndex={-1} autoComplete="off" />
    </label>
  );
}

export function QuoteForm({ compact = false, light = false }: QuoteFormProps) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = parseIsraeliPhone(String(data.get("phone") ?? ""));
    if (!phone) {
      form.reportValidity();
      return;
    }

    setSending(true);
    setError(false);

    const result = await submitLead({
      source: compact ? "footer" : light ? "home" : "contact",
      name: String(data.get("name") ?? ""),
      phone,
      email: String(data.get("email") ?? ""),
      city: String(data.get("city") ?? ""),
      business: String(data.get("business") ?? ""),
      businessType: String(data.get("biz") ?? ""),
      topic: String(data.get("topic") ?? data.get("solution") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    });

    setSending(false);
    if (!result.ok) {
      setError(true);
      return;
    }
    setSent(true);
  }

  if (sent) {
    if (light) {
      return (
        <div className="lead-form">
          <div className="lead-form-title">קיבלנו את הפרטים.</div>
          <p className="lead-form-note">נחזור אליכם בהקדם. אם זה דחוף - {SITE.phoneUrgent}.</p>
        </div>
      );
    }

    if (compact) {
      return (
        <div className="contact-form">
          <div className="contact-form-title">קיבלנו את הפרטים.</div>
          <p className="contact-form-note">נחזור אליכם בהקדם. אם זה דחוף - {SITE.phoneUrgent}.</p>
        </div>
      );
    }

    return (
      <div className="quote-form">
        <div>
          <div className="quote-form-title">קיבלנו את הפרטים.</div>
          <p className="quote-form-note">נחזור אליכם בהקדם. אם זה דחוף - {SITE.phoneUrgent}.</p>
        </div>
        <Link href="/catalog" className="quote-form-link">
          בינתיים, לקטלוג ←
        </Link>
      </div>
    );
  }

  const errorNote = error ? <p className="form-submit-error">לא הצלחנו לשלוח. נסו שוב או התקשרו.</p> : null;
  const submitLabel = sending ? "שולחים..." : "שליחה";

  if (light) {
    return (
      <form className="lead-form" onSubmit={onSubmit}>
        <div>
          <div className="lead-form-title">השאירו פרטים</div>
          <p className="lead-form-note">נחזור אליכם עם כיוון לציוד שמתאים לעסק.</p>
        </div>
        <Honeypot />
        <label className="field">
          <span>שם מלא</span>
          <input name="name" type="text" placeholder="שם מלא" required />
        </label>
        <div className="lead-form-row">
          <PhoneField />
          <label className="field">
            <span>עיר</span>
            <input name="city" type="text" placeholder="עיר" required />
          </label>
        </div>
        <label className="field">
          <span>הודעה</span>
          <textarea name="message" rows={3} placeholder="ספרו לנו על העסק, החלל או הציוד שאתם מחפשים" />
        </label>
        {errorNote}
        <button type="submit" className="btn btn-ink" disabled={sending}>
          {submitLabel}
        </button>
      </form>
    );
  }

  if (compact) {
    return (
      <form className="contact-form" onSubmit={onSubmit}>
        <div>
          <div className="contact-form-title">השאירו פרטים</div>
          <p className="contact-form-note">נחזור אליכם בהקדם עם כיוון מתאים.</p>
        </div>
        <Honeypot />
        <label className="field">
          <span>שם מלא</span>
          <input name="name" type="text" placeholder="שם מלא" required />
        </label>
        <div className="lead-form-row">
          <PhoneField />
          <label className="field field-wrap">
            <span>סוג הציוד</span>
            <select name="topic" defaultValue="חלביות">
              <option>חלביות</option>
              <option>מעדניות</option>
              <option>מקררים</option>
              <option>מקפיאים תעשייתיים</option>
            </select>
            <span className="field-caret">▾</span>
          </label>
        </div>
        {errorNote}
        <button type="submit" className="btn btn-white" disabled={sending}>
          {submitLabel}
        </button>
      </form>
    );
  }

  return (
    <form className="quote-form" onSubmit={onSubmit}>
      <div>
        <div className="quote-form-title">השאירו פרטים</div>
        <p className="quote-form-note">נחזור אליכם עם תצורה שמתאימה לעסק ולחלל.</p>
      </div>
      <Honeypot />
      <div className="quote-form-grid">
        <label className="field">
          <span>שם מלא</span>
          <input name="name" type="text" placeholder="שם מלא" required />
        </label>
        <label className="field">
          <span>שם העסק</span>
          <input name="business" type="text" placeholder="שם העסק" />
        </label>
        <PhoneField />
        <label className="field">
          <span>אימייל</span>
          <input name="email" type="email" placeholder="name@business.co.il" style={{ direction: "ltr", textAlign: "right" }} />
        </label>
        <label className="field field-wrap">
          <span>סוג העסק</span>
          <select name="biz" defaultValue="סופרמרקט או מינימרקט">
            <option>סופרמרקט או מינימרקט</option>
            <option>קצבייה</option>
            <option>מעדנייה</option>
            <option>חנות מזון או מכולת</option>
            <option>בית קפה</option>
            <option>אחר</option>
          </select>
          <span className="field-caret">▾</span>
        </label>
        <label className="field field-wrap">
          <span>סוג הציוד</span>
          <select name="solution" defaultValue="חלביות">
            <option>חלביות</option>
            <option>מעדניות</option>
            <option>מקררים</option>
            <option>מקפיאים תעשייתיים</option>
            <option>לא בטוחים / צריכים ייעוץ</option>
          </select>
          <span className="field-caret">▾</span>
        </label>
        <label className="field quote-form-message">
          <span>הודעה</span>
          <textarea name="message" rows={4} placeholder="מידות החלל, מה מוצג, מתי צריך" />
        </label>
      </div>
      {errorNote}
      <button type="submit" className="btn btn-ink" disabled={sending}>
        {submitLabel}
      </button>
    </form>
  );
}
