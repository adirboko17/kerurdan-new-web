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
          width={900}
          height={620}
          sizes="(max-width: 900px) 92vw, 380px"
          quality={72}
          loading="eager"
          unoptimized={isLocal}
          className="product-blueprint-img"
        />
      </div>
    </figure>
  );
}
