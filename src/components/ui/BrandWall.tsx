import Image from "next/image";
import type { Brand } from "@/lib/types";

export function BrandWall({ brands }: { brands: Brand[] }) {
  return (
    <div className="brand-wall">
      {brands.map((brand) => (
        <div className="brand-cell" key={`${brand.name}-${brand.src}`}>
          <div className="brand-inner">
            <Image
              src={brand.src}
              alt={brand.name}
              fill
              sizes="(max-width: 620px) 50vw, (max-width: 1100px) 25vw, 16vw"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      ))}
      <div className="brand-cell brand-more">
        <span>+120 עסקים</span>
      </div>
    </div>
  );
}
