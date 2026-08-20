import Image from "next/image";
import type { ProductBlueprint as Blueprint } from "@/lib/blueprints";

export function ProductBlueprint({ blueprint }: { blueprint: Blueprint }) {
  return (
    <figure className="product-blueprint">
      <div className="product-blueprint-frame">
        <Image
          src={blueprint.src}
          alt={blueprint.alt}
          fill
          sizes="(max-width: 900px) 100vw, 560px"
          unoptimized
          className="product-blueprint-img"
        />
      </div>
    </figure>
  );
}
