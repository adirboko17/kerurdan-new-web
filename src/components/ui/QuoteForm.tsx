"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

type QuoteFormProps = {
  compact?: boolean;
  light?: boolean;
};

export function QuoteForm({ compact = false, light = false }: QuoteFormProps) {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

  if (light) {
    return (
      <form className="lead-form" onSubmit={onSubmit}>
        <div>
          <div className="lead-form-title">השאירו פרטים</div>
          <p className="lead-form-note">נחזור אליכם עם כיוון לציוד שמתאים לעסק.</p>
        </div>
        <label className="field">
          <span>שם מלא</span>
          <input name="name" type="text" placeholder="שם מלא" required />
        </label>
        <div className="lead-form-row">
          <label className="field">
            <span>טלפון</span>
            <input name="phone" type="tel" placeholder="050-0000000" required style={{ direction: "ltr", textAlign: "right" }} />
          </label>
          <label className="field">
            <span>עיר</span>
            <input name="city" type="text" placeholder="עיר" required />
          </label>
        </div>
        <label className="field">
          <span>הודעה</span>
          <textarea name="message" rows={3} placeholder="ספרו לנו על העסק, החלל או הציוד שאתם מחפשים" />
        </label>
        <button type="submit" className="btn btn-ink">
          שליחה
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
        <label className="field">
          <span>שם מלא</span>
          <input name="name" type="text" placeholder="שם מלא" required />
        </label>
        <div className="lead-form-row">
          <label className="field">
            <span>טלפון</span>
            <input name="phone" type="tel" placeholder="050-0000000" required style={{ direction: "ltr", textAlign: "right" }} />
          </label>
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
        <button type="submit" className="btn btn-white">
          שליחה
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
      <div className="quote-form-grid">
        <label className="field">
          <span>שם מלא</span>
          <input name="name" type="text" placeholder="שם מלא" required />
        </label>
        <label className="field">
          <span>שם העסק</span>
          <input name="business" type="text" placeholder="שם העסק" />
        </label>
        <label className="field">
          <span>טלפון</span>
          <input name="phone" type="tel" placeholder="050-0000000" required style={{ direction: "ltr", textAlign: "right" }} />
        </label>
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
          <span>באיזה פתרון אתם מתעניינים?</span>
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
      <button type="submit" className="btn btn-ink">
        שליחה
      </button>
    </form>
  );
}
