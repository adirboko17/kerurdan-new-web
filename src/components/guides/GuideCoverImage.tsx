import { getGuideCover } from "@/lib/guide-covers";

type GuideCoverImageProps = {
  slug: string;
  priority?: boolean;
  className?: string;
};

export function GuideCoverImage({ slug, priority, className = "" }: GuideCoverImageProps) {
  const cover = getGuideCover(slug);
  if (!cover) return null;

  const webp = `/guides/${cover.file}.webp`;
  const jpg = `/guides/${cover.file}.jpg`;

  return (
    <picture className={`guide-cover-picture ${className}`.trim()}>
      <source srcSet={webp} type="image/webp" />
      <img
        src={jpg}
        alt={cover.alt}
        className="guide-cover-img"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}
