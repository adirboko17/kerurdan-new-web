"use client";

import { useEffect, useState } from "react";

export function HeroVideo() {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 759px)");
    const apply = () => setMobile(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  if (mobile === null) return null;

  return (
    <video
      key={mobile ? "mobile" : "desktop"}
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      onCanPlayThrough={() => window.dispatchEvent(new Event("hero-video-ready"))}
      onError={() => window.dispatchEvent(new Event("hero-video-ready"))}
    >
      <source src={mobile ? "/hero-mobile.mp4" : "/hero.mp4"} type="video/mp4" />
    </video>
  );
}
