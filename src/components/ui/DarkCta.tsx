import Link from "next/link";
import type { ReactNode } from "react";

type DarkCtaProps = {
  title: string;
  text?: string;
  titleWidth?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export function DarkCta({ title, text, titleWidth, children, actions }: DarkCtaProps) {
  return (
    <section className="dark-cta">
      <div className="dark-cta-inner">
        <h2 style={{ maxWidth: titleWidth }}>{title}</h2>
        <div>
          {text && <p>{text}</p>}
          {children}
          {actions && <div className="dark-cta-actions">{actions}</div>}
        </div>
      </div>
    </section>
  );
}

export function QuoteButton({ light = false }: { light?: boolean }) {
  return (
    <Link href="/contact" className={light ? "btn btn-blue" : "btn btn-ink"}>
      קבלו הצעת מחיר
    </Link>
  );
}

export function WhatsAppButton() {
  return (
    <a href="https://wa.me/972586776545" className="btn btn-ghost-light">
      דברו איתנו
    </a>
  );
}
