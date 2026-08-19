import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

export function HomeSelected({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section>
      <div className="selected-head">
        <Reveal>
          <h2>דגמים נבחרים</h2>
        </Reveal>
        <Link href="/catalog" className="link-underline">
          לכל הקטלוג ←
        </Link>
      </div>
      <Reveal className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </Reveal>
    </section>
  );
}
