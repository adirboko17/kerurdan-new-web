import Image from "next/image";
import type { ProductBlueprint as Blueprint } from "@/lib/blueprints";

export function ProductBlueprint({ blueprint }: { blueprint: Blueprint }) {
  const isLocal = blueprint.src.startsWith("/");

  return (
    <figure className="product-blueprint">
      <div className="product-blueprint-frame">
        <Image
          src={blueprint.src}
          alt={blueprint.alt}
          fill
          sizes="(max-width: 900px) 92vw, 360px"
          quality={72}
          loading="eager"
          unoptimized={isLocal}
          className="product-blueprint-img"
        />
      </div>
    </figure>
  );
}
