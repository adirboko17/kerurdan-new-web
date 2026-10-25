import { renderGuideInline } from "@/lib/guide-markdown";
import type { GuideFaqItem } from "@/lib/guides";

export function GuideFaqAccordion({ faq }: { faq: GuideFaqItem[] }) {
  if (!faq.length) return null;

  return (
    <section className="guide-faq" aria-labelledby="guide-faq-title">
      <h2 id="guide-faq-title">שאלות נפוצות</h2>
      <div className="guide-faq-list">
        {faq.map((item) => (
          <details key={item.question} className="guide-faq-item">
            <summary>{item.question}</summary>
            <div className="guide-faq-answer">{renderGuideInline(item.answer, item.question)}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
