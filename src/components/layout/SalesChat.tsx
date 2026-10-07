"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatLeadForm } from "@/components/layout/ChatLeadForm";
import { SITE } from "@/lib/site";

type ProductCard = {
  slug: string;
  name: string;
  href: string;
  image: string | null;
  category: string;
  height: string | null;
  depth: string | null;
  width: string | null;
  volume: string | null;
  widths: string[];
};

type Turn = {
  role: "user" | "assistant";
  content: string;
  cards?: ProductCard[];
};

const SUGGESTIONS = ["פותח מכולת וצריך קירור לחלב", "מחפש ויטרינה לקצבייה", "איזה מקרר עומד מתאים לבית קפה?"];

function AdvisorIcon() {
  return (
    <svg className="is-bubble" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 3.15c-4.72 0-8.45 3.18-8.45 7.02 0 2.14 1.18 4.05 3.02 5.32l-.62 2.72a.72.72 0 0 0 1.05.8l3.05-1.55c.62.12 1.28.18 1.95.18 4.72 0 8.45-3.18 8.45-7.02S16.72 3.15 12 3.15zM8.15 9.35a1.12 1.12 0 1 1 0 2.24 1.12 1.12 0 0 1 0-2.24zm3.85 0a1.12 1.12 0 1 1 0 2.24 1.12 1.12 0 0 1 0-2.24zm3.85 0a1.12 1.12 0 1 1 0 2.24 1.12 1.12 0 0 1 0-2.24z"
      />
    </svg>
  );
}

function wantsQuote(text: string) {
  if (/לא רוצה|לא מעוניין|לא מעוניינת|לא צריך/.test(text)) return false;
  return /רוצה|מתאים|אהבתי|מעוניין|מעוניינת|הצעת מחיר|תחזרו|תחזור|תתקשרו|תתקשר|אשמח|נשמח|להזמין/.test(text);
}

function isSafeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//") && !href.includes(":")) return true;
  return href.startsWith(SITE.whatsapp);
}

function ProductCards({ cards }: { cards: ProductCard[] }) {
  return (
    <div className="sales-chat-cards">
      {cards.map((card) => (
        <Link key={card.slug} href={card.href} className="sales-chat-card">
          {card.image ? <img src={card.image} alt="" /> : <span className="sales-chat-card-photo" />}
          <span className="sales-chat-card-copy">
            <strong>{card.name}</strong>
            {card.category ? <span>{card.category}</span> : null}
          </span>
          {card.width && card.height && card.depth ? (
            <span className="sales-chat-size">
              <span className="sales-chat-size-label">המידה שמתאימה</span>
              <span className="sales-chat-dims">
                <span>
                  <b>{card.height}</b>
                  <small>גובה</small>
                </span>
                <span>
                  <b>{card.depth}</b>
                  <small>עומק</small>
                </span>
                <span className="is-width">
                  <b>{card.width}</b>
                  <small>רוחב</small>
                </span>
              </span>
              <span className="sales-chat-size-unit">ס״מ{card.volume ? ` · נפח ${card.volume} ל׳` : ""}</span>
            </span>
          ) : card.widths.length ? (
            <span className="sales-chat-size">
              <span className="sales-chat-size-label">רוחבים בקטלוג</span>
              <span className="sales-chat-widths">
                {card.widths.map((width) => (
                  <b key={width}>{width}</b>
                ))}
                <small>ס״מ</small>
              </span>
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

function MessageBody({ text }: { text: string }) {
  const parts = text.split(/\[([^\]]+)\]\(([^)\s]+)\)/g);
  const nodes = [];
  for (let index = 0; index < parts.length; index += 3) {
    if (parts[index]) nodes.push(<span key={`t-${index}`}>{parts[index]}</span>);
    const label = parts[index + 1];
    const href = parts[index + 2];
    if (!label || !href || !isSafeHref(href)) continue;
    const external = href.startsWith("http");
    nodes.push(
      <Link
        key={`l-${index}`}
        href={href}
        className="sales-chat-link"
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {label}
      </Link>,
    );
  }
  return <>{nodes}</>;
}

export function SalesChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [leadOpen, setLeadOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [turns, sending, open, leadOpen]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || sendingRef.current) return;
    sendingRef.current = true;

    const history = [...turns, { role: "user" as const, content }];
    if (wantsQuote(content) && turns.some((turn) => turn.cards?.length)) setLeadOpen(true);
    setTurns(history);
    setDraft("");
    setError("");
    setSending(true);

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          messages: history.map((turn) => ({
            role: turn.role,
            content: turn.content,
            cards: turn.cards?.map((card) => ({ name: card.name, width: card.width })),
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "לא הצלחנו לקבל תשובה.");
      }

      const payload = (await response.json()) as { message?: string; cards?: ProductCard[] };
      const message = payload.message?.trim() ?? "";
      const cards = Array.isArray(payload.cards) ? payload.cards : [];
      if (!message && !cards.length) {
        setError("לא התקבלה תשובה. נסו לנסח שוב, או דברו איתנו בוואטסאפ.");
        return;
      }
      setTurns([...history, { role: "assistant", content: message, cards }]);
    } catch (caught) {
      if (controller.signal.aborted) return;
      setTurns(history);
      setError(caught instanceof Error ? caught.message : "לא הצלחנו לקבל תשובה.");
    } finally {
      if (!controller.signal.aborted) {
        sendingRef.current = false;
        setSending(false);
      }
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(draft);
  }

  return (
    <div className={`sales-chat${open ? " is-open" : ""}`}>
      {open ? (
        <section className="sales-chat-panel" role="dialog" aria-label="יועץ קירור דן">
          <header className="sales-chat-head">
            <div className="sales-chat-brand">
              <span className="sales-chat-mark" aria-hidden="true">
                <AdvisorIcon />
              </span>
              <div>
                <strong>יועץ קירור דן</strong>
                <span className="sales-chat-status">
                  <i aria-hidden="true" />
                  זמין
                </span>
              </div>
            </div>
            <button type="button" className="sales-chat-close" onClick={() => setOpen(false)} aria-label="סגירת היועץ">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div className="sales-chat-log" ref={listRef} aria-live="polite">
            <article className="sales-chat-msg is-agent">
              <p className="sales-chat-text">
                היי, אני כאן לעזור לבחור ציוד קירור שמתאים לעסק. ספרו מה אתם מחפשים - סוג העסק, מה מוכרים, והחלל.
              </p>
            </article>

            {turns.map((turn, index) => {
              const latestOffer = turns.findLastIndex((item) => item.cards?.length) === index;
              return (
                <article
                  key={`${turn.role}-${index}`}
                  className={`sales-chat-msg${turn.role === "user" ? " is-user" : " is-agent"}${turn.cards?.length ? " has-cards" : ""}`}
                >
                  {turn.content ? (
                    <p className="sales-chat-text">
                      <MessageBody text={turn.content} />
                    </p>
                  ) : null}
                  {turn.cards?.length ? <ProductCards cards={turn.cards} /> : null}
                  {latestOffer && turn.cards?.length ? (
                    <ChatLeadForm
                      key={turn.cards.map((card) => card.slug).join("-")}
                      items={turn.cards}
                      open={leadOpen}
                      onOpen={() => setLeadOpen(true)}
                    />
                  ) : null}
                </article>
              );
            })}

            {sending ? (
              <p className="sales-chat-wait" role="status">
                <span className="sales-chat-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                בודק מה מתאים מהקטלוג…
              </p>
            ) : null}
            {error ? <p className="sales-chat-error">{error}</p> : null}

            {!turns.length && !sending ? (
              <div className="sales-chat-suggestions">
                {SUGGESTIONS.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => void send(suggestion)}>
                    <span>{suggestion}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14 6 8 12l6 6" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form className="sales-chat-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="sales-chat-input">
              הודעה ליועץ
            </label>
            <textarea
              id="sales-chat-input"
              ref={inputRef}
              rows={2}
              value={draft}
              placeholder="למשל: מכולת, צריך חלבייה של כ־2 מטר"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(draft);
                }
              }}
            />
            <button type="submit" disabled={sending || !draft.trim()}>
              שליחה
            </button>
          </form>
          <p className="sales-chat-note">
            אחרי בחירת דגם אפשר להשאיר שם וטלפון כאן, או לשלוח את הדגמים בוואטסאפ. השיחה עצמה לא נשמרת כפנייה.
          </p>
        </section>
      ) : null}

      <button
        type="button"
        className="sales-chat-toggle"
        aria-expanded={open}
        aria-label={open ? "סגירת היועץ" : "פתיחת יועץ קירור דן"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sales-chat-label">יועץ</span>
        <span className="sales-chat-icon">
          <AdvisorIcon />
        </span>
      </button>
    </div>
  );
}
