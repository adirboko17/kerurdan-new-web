import Image from "next/image";
import type { ImageFit } from "@/lib/types";

type SiteImageProps = {
  src: string;
  alt: string;
  fit?: ImageFit;
  sizes?: string;
  priority?: boolean;
  className?: string;
  padding?: string;
  blend?: boolean;
};

export function SiteImage({
  src,
  alt,
  fit = "contain",
  sizes = "(max-width: 900px) 100vw, 50vw",
  priority,
  className,
  padding,
  blend,
}: SiteImageProps) {
  const isGif = src.endsWith(".gif");
  const useBlend = blend ?? fit === "contain";

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={isGif}
      className={className}
      style={{
        objectFit: fit,
        padding: fit === "contain" ? padding ?? "11%" : undefined,
        mixBlendMode: useBlend ? "multiply" : "normal",
      }}
    />
  );
}
