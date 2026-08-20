"use client";

import { FormEvent, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { submitProductQuote } from "@/app/actions/quote-request";

type Origin = { top: number; left: number; width: number; height: number };
type Phase = "closed" | "opening" | "open" | "closing";

type ProductQuoteButtonProps = {
  productName: string;
  productSlug: string;
  productId?: string;
  className?: string;
  children?: string;
};

export function ProductQuoteButton({
  productName,
  productSlug,
  productId,
  className = "btn btn-ink",
  children = "קבלו הצעת מחיר",
}: ProductQuoteButtonProps) {
  const titleId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("closed");
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (phase === "closed") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  useLayoutEffect(() => {
    if (phase !== "opening" || !cardRef.current || !origin) return;

    const card = cardRef.current;
    const inner = innerRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setPhase("open");
      return;
    }

    const last = card.getBoundingClientRect();
    const dx = origin.left - last.left;
    const dy = origin.top - last.top;
    const sx = Math.max(origin.width / last.width, 0.08);
    const sy = Math.max(origin.height / last.height, 0.08);

    card.style.transition = "none";
    card.style.transformOrigin = "top left";
    card.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    card.style.borderRadius = "9px";
    card.style.background = "#0a0b0c";
    if (inner) {
      inner.style.opacity = "0";
      inner.style.transform = "translateY(8px)";
    }

    let opened = false;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.transition = [
          "transform 0.64s cubic-bezier(0.16, 1, 0.3, 1)",
          "border-radius 0.64s cubic-bezier(0.16, 1, 0.3, 1)",
          "background 0.48s ease",
        ].join(", ");
        card.style.transform = "none";
        card.style.borderRadius = "22px";
        card.style.background = "#fff";
        if (inner) {
          inner.style.transition = "opacity 0.4s ease 0.2s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s";
          inner.style.opacity = "1";
          inner.style.transform = "none";
        }
      });
    });

    const timer = window.setTimeout(() => {
      opened = true;
      setPhase("open");
      nameRef.current?.focus();
    }, 680);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      if (!opened) card.style.transition = "";
    };
  }, [phase, origin]);

  function open() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setOrigin({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    }
    setSent(false);
    setError(false);
    setPhase("opening");
  }

  function finishClose() {
    const card = cardRef.current;
    if (card) {
      card.style.transition = "";
      card.style.transform = "";
      card.style.borderRadius = "";
      card.style.background = "";
    }
    setPhase("closed");
    setSent(false);
    setSending(false);
    setError(false);
  }

  function close() {
    if (phase === "closing" || phase === "closed") return;

    const card = cardRef.current;
    const btn = buttonRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sent || reduced || !card || !btn) {
      setPhase("closing");
      window.setTimeout(finishClose, sent || reduced ? 380 : 0);
      return;
    }

    const first = card.getBoundingClientRect();
    const last = btn.getBoundingClientRect();
    const dx = last.left - first.left;
    const dy = last.top - first.top;
    const sx = last.width / first.width;
    const sy = last.height / first.height;
    const inner = innerRef.current;

    if (inner) {
      inner.style.transition = "opacity 0.16s ease";
      inner.style.opacity = "0";
    }

    card.style.transition = [
      "transform 0.48s cubic-bezier(0.4, 0, 0.2, 1)",
      "border-radius 0.48s cubic-bezier(0.4, 0, 0.2, 1)",
      "background 0.36s ease",
    ].join(", ");
    card.style.transformOrigin = "top left";
    card.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    card.style.borderRadius = "9px";
    card.style.background = "#0a0b0c";

    setPhase("closing");
    window.setTimeout(finishClose, 500);
  }

  useEffect(() => {
    if (phase === "closed") return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !sending) close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!sent) return;
    const timer = window.setTimeout(() => {
      setPhase("closing");
      window.setTimeout(finishClose, 420);
    }, 3400);
    return () => window.clearTimeout(timer);
  }, [sent]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const data = new FormData(event.currentTarget);
    setSending(true);
    setError(false);

    const result = await submitProductQuote({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      city: String(data.get("city") ?? ""),
      productName,
      productSlug,
      productId,
    });

    if (!result.ok) {
      setSending(false);
      setError(true);
      return;
    }

    setSending(false);
    setSent(true);
  }

  const openUi = phase !== "closed";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={className}
        onClick={open}
        aria-expanded={openUi}
        aria-haspopup="dialog"
        style={openUi ? { visibility: "hidden" } : undefined}
      >
        {children}
      </button>

      {mounted && openUi
        ? createPortal(
            <div
              className={[
                "quote-pop",
                phase === "closing" ? "is-closing" : "",
                sent ? "is-sent" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <button type="button" className="quote-pop-backdrop" aria-label="סגירה" onClick={close} />
              <div ref={cardRef} className="quote-pop-card">
                <div ref={innerRef} className="quote-pop-inner">
                  {sent ? (
                    <div className="quote-pop-thanks">
                      <div className="quote-pop-check" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5.2 12.4l4.4 4.4 9.2-9.4"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <h2 id={titleId}>תודה שפנית אלינו</h2>
                      <p>נחזור אלייך בהקדם</p>
                    </div>
                  ) : (
                    <form className="quote-pop-form" onSubmit={onSubmit}>
                      <button type="button" className="quote-pop-close" onClick={close} aria-label="סגירה">
                        <span aria-hidden="true">×</span>
                      </button>
                      <div className="quote-pop-head">
                        <p className="quote-pop-kicker">{productName}</p>
                        <h2 id={titleId}>קבלו הצעת מחיר</h2>
                        <p className="quote-pop-note">השאירו פרטים ונחזור אליכם עם הצעה לדגם.</p>
                      </div>
                      <label className="field quote-pop-field">
                        <span>שם מלא</span>
                        <input ref={nameRef} name="name" type="text" placeholder="שם מלא" autoComplete="name" required />
                      </label>
                      <label className="field quote-pop-field">
                        <span>מספר טלפון</span>
                        <input
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          placeholder="050-0000000"
                          autoComplete="tel"
                          required
                          style={{ direction: "ltr", textAlign: "right" }}
                        />
                      </label>
                      <label className="field quote-pop-field">
                        <span>עיר</span>
                        <input name="city" type="text" placeholder="עיר" autoComplete="address-level2" required />
                      </label>
                      {error ? <p className="quote-pop-error">לא הצלחנו לשלוח. נסו שוב או התקשרו.</p> : null}
                      <button type="submit" className="btn btn-ink quote-pop-submit" disabled={sending}>
                        {sending ? "שולחים..." : "שליחה"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
