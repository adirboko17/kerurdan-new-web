import type { CSSProperties } from "react";
import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import type { Product } from "@/lib/types";

const LAYOUT = [
  { tilt: -11, lift: 6, z: 2 },
  { tilt: -4, lift: -26, z: 5 },
  { tilt: 9, lift: 20, z: 1 },
  { tilt: -7, lift: -4, z: 4 },
  { tilt: 2, lift: 28, z: 3 },
  { tilt: 10, lift: -14, z: 2 },
];

export function CategoryHeroShots({ products }: { products: Product[] }) {
  const shots = products.filter((product) => product.images[0]).slice(0, 6);
  if (shots.length < 2) return null;

  return (
    <div className="cat-hero-shots">
      {shots.map((product, index) => {
        const image = product.images[0];
        const layout = LAYOUT[index] ?? LAYOUT[0];
        return (
          <Link
            key={product.slug}
            href={`/product/${product.slug}`}
            className="cat-shot"
            style={
              {
                "--tilt": `${layout.tilt}deg`,
                "--lift": `${layout.lift}px`,
                "--z": layout.z,
              } as CSSProperties
            }
            aria-label={product.name}
          >
            <div className="cat-shot-frame">
              <SiteImage
                src={image.src}
                alt={image.alt}
                fit="contain"
                padding="10%"
                sizes="200px"
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
