import Image from "next/image";
import type { ImageFit } from "@/lib/types";

type SiteImageProps = {
  src: string;
  alt: string;
  fit?: ImageFit;
  sizes?: string;
  priority?: boolean;
  eager?: boolean;
  className?: string;
  padding?: string;
  blend?: boolean;
  onLoad?: () => void;
};

export function SiteImage({
  src,
  alt,
  fit = "contain",
  sizes = "(max-width: 900px) 100vw, 50vw",
  priority,
  eager,
  className,
  padding,
  blend,
  onLoad,
}: SiteImageProps) {
  const isLocal = src.startsWith("/");
  const isGif = src.endsWith(".gif");
  const useBlend = blend ?? fit === "contain";

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : eager ? "eager" : undefined}
      unoptimized={isGif || isLocal}
      className={className}
      onLoad={onLoad}
      style={{
        objectFit: fit,
        padding: fit === "contain" ? padding ?? "11%" : undefined,
        mixBlendMode: useBlend ? "multiply" : "normal",
      }}
    />
  );
}
