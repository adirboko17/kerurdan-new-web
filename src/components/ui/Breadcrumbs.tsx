import Link from "next/link";

type Crumb = {
  href?: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="מיקום בעמוד">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} style={{ display: "contents" }}>
            {index > 0 && <span className="crumbs-sep">/</span>}
            {item.href && !last ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span className={last ? "crumbs-current" : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
