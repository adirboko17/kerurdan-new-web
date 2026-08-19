"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

type QuoteFormProps = {
  compact?: boolean;
};

export function QuoteForm({ compact = false }: QuoteFormProps) {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    if (compact) {
      return (
        <div style={{ borderTop: "1px solid rgba(255,255,255,.24)", paddingTop: 26 }}>
          <div style={{ fontSize: "clamp(20px,2.2vw,30px)", fontWeight: 600, letterSpacing: "-.02em" }}>
            קיבלנו את הפרטים.
          </div>
          <div
            style={{
              color: "rgba(255,255,255,.65)",
              fontSize: 16,
              lineHeight: 1.7,
              marginTop: 12,
              fontWeight: 300,
            }}
          >
            נחזור אליכם בהקדם. אם זה דחוף - {SITE.phoneUrgent}.
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          border: "1px solid rgba(255,255,255,.2)",
          borderRadius: 16,
          padding: "clamp(28px,3.4vw,48px)",
        }}
      >
        <div style={{ fontSize: "clamp(22px,2.4vw,32px)", fontWeight: 600, letterSpacing: "-.02em" }}>
          קיבלנו את הפרטים.
        </div>
        <div
          style={{
            color: "rgba(255,255,255,.65)",
            fontSize: 16,
            lineHeight: 1.7,
            marginTop: 14,
            fontWeight: 300,
          }}
        >
          נחזור אליכם בהקדם. אם זה דחוף - {SITE.phoneUrgent}.
        </div>
        <Link
          href="/catalog"
          style={{
            display: "inline-block",
            marginTop: 22,
            fontSize: 15,
            fontWeight: 600,
            borderBottom: "1.5px solid rgba(255,255,255,.5)",
            paddingBottom: 3,
          }}
        >
          בינתיים, לקטלוג ←
        </Link>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(18px,2.2vw,26px)" }}>
        <label className="field">
          <span>שם</span>
          <input name="name" type="text" placeholder="שם מלא" required />
        </label>
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
        <button type="submit" className="btn btn-blue" style={{ alignSelf: "flex-start", marginTop: 4, padding: "17px 32px" }}>
          שליחה
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
        gap: "clamp(16px,2vw,22px)",
      }}
    >
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
      <label className="field" style={{ gridColumn: "1 / -1" }}>
        <span>הודעה</span>
        <textarea name="message" rows={4} placeholder="מידות החלל, מה מוצג, מתי צריך" />
      </label>
      <button
        type="submit"
        className="btn btn-blue"
        style={{ gridColumn: "1 / -1", justifySelf: "start", padding: "17px 34px", fontSize: 15.5 }}
      >
        שליחה
      </button>
    </form>
  );
}
