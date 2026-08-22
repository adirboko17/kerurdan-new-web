"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCookieConsent, writeCookieConsent, type CookieConsent } from "@/lib/cookie-consent";

const FULL_COPY =
  "האתר משתמש בעוגיות חיוניות להפעלתו, ובעוגיות מדידה ופרסום (Google Analytics, Google Ads ו־Meta Pixel) לשיפור האתר ולמדידת קמפיינים.";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (readCookieConsent()) return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  function choose(value: CookieConsent) {
    writeCookieConsent(value);
    setVisible(false);
  }

  return (
    <div className="cookie-bar" role="dialog" aria-label="הודעה על שימוש בעוגיות">
      <div className="cookie-bar-copy">
        <span className="cookie-bar-icon" aria-hidden="true">
          <svg viewBox="0 0 80 80">
            <path
              fill="#c98432"
              d="M38 9A31 31 0 1 0 71 43a13 13 0 0 1-16-8 12 12 0 0 1-4-14 13 13 0 0 1-13-12Z"
            />
            <path
              fill="#efb75a"
              d="M38 12A28 28 0 1 0 68 43a12 12 0 0 1-15-7 11 11 0 0 1-3-13 12 12 0 0 1-12-11Z"
            />
            <path
              d="M68 43a12 12 0 0 1-15-7 11 11 0 0 1-3-13 12 12 0 0 1-12-11"
              stroke="#c47e2e"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="26" cy="30" rx="12" ry="8" fill="#f7d08a" opacity=".65" />
            <circle cx="24" cy="36" r="4.4" fill="#4e2a12" />
            <circle cx="22.8" cy="34.6" r="1.4" fill="#8a5530" opacity=".75" />
            <circle cx="36" cy="30" r="3.2" fill="#5a3016" />
            <circle cx="35.2" cy="29" r="1" fill="#8a5530" opacity=".7" />
            <circle cx="42" cy="46" r="3.8" fill="#43210e" />
            <circle cx="40.8" cy="44.8" r="1.2" fill="#7a4a28" opacity=".65" />
            <circle cx="28" cy="52" r="2.7" fill="#5a3016" />
            <circle cx="22" cy="46" r="1.8" fill="#43210e" />
          </svg>
        </span>
        <div className="cookie-bar-text">
          <p className="cookie-bar-full">
            {FULL_COPY}{" "}
            <Link href="/privacy">מדיניות פרטיות ועוגיות</Link>
          </p>
          <p className="cookie-bar-brief">
            {expanded ? (
              <>
                {FULL_COPY}{" "}
                <Link href="/privacy">מדיניות פרטיות ועוגיות</Link>
              </>
            ) : (
              "האתר משתמש בעוגיות להפעלה, מדידה ופרסום."
            )}{" "}
            <button
              type="button"
              className="cookie-bar-toggle"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "הצג פחות" : "קרא עוד"}
            </button>
          </p>
        </div>
      </div>
      <div className="cookie-bar-actions">
        <button type="button" className="btn btn-ink" onClick={() => choose("all")}>
          אישור הכל
        </button>
        <button type="button" className="btn btn-ghost-dark" onClick={() => choose("essential")}>
          <span className="cookie-bar-reject-full">דחיית עוגיות לא חיוניות</span>
          <span className="cookie-bar-reject-short">רק חיוניות</span>
        </button>
      </div>
    </div>
  );
}
