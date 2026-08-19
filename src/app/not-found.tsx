import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section className="page-hero" style={{ minHeight: "50vh" }}>
        <h1>העמוד לא נמצא</h1>
        <p style={{ marginTop: 20 }}>ייתכן שהקישור השתנה. אפשר לחזור לקטלוג או לדף הבית.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
          <Link href="/" className="btn btn-ink">
            לדף הבית
          </Link>
          <Link href="/catalog" className="btn btn-ghost-dark">
            לקטלוג
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
