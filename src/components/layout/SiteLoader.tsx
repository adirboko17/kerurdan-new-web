"use client";

import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const FLAKES = 28;

export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const flakes = useMemo(
    () =>
      Array.from({ length: FLAKES }, (_, index) => ({
        id: index,
        left: `${4 + ((index * 17) % 92)}%`,
        delay: `${(index * 0.37) % 4.8}s`,
        duration: `${7 + (index % 5) * 1.4}s`,
        size: `${6 + (index % 7) * 3}px`,
        drift: `${index % 2 === 0 ? 22 : -20}px`,
        opacity: 0.35 + (index % 5) * 0.1,
      })),
    [],
  );

  useEffect(() => {
    try {
      if (sessionStorage.getItem("kd-intro") === "1") {
        setVisible(false);
        return;
      }
    } catch {
      /* ignore */
    }

    document.body.style.overflow = "hidden";

    let cancelled = false;
    let value = 0;
    let videoReady = !document.querySelector(".hero") && !document.querySelector(".page.is-home");
    let pageReady = document.readyState === "complete";
    let finished = false;
    let frame = 0;

    const complete = () => {
      if (finished || cancelled) return;
      finished = true;
      setProgress(100);
      try {
        sessionStorage.setItem("kd-intro", "1");
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        window.setTimeout(() => {
          if (cancelled) return;
          document.documentElement.classList.add("intro-done");
          document.body.style.overflow = "";
          setVisible(false);
        }, 780);
      }, 240);
    };

    const step = () => {
      if (cancelled || finished) return;
      const ready = videoReady && pageReady;
      const target = ready ? 100 : Math.min(90, value + Math.max(0.4, (90 - value) * 0.035));
      value = Math.min(100, value + (target - value) * 0.12 + (ready ? 2.4 : 0.18));
      setProgress(Math.round(value));
      if (value >= 99.2 && ready) {
        complete();
        return;
      }
      frame = window.requestAnimationFrame(step);
    };

    const onVideo = () => {
      videoReady = true;
    };
    const onLoad = () => {
      pageReady = true;
    };
    const markNoVideo = window.setTimeout(() => {
      if (!document.querySelector(".hero") && !document.querySelector(".page.is-home")) {
        videoReady = true;
      }
    }, 400);
    const failsafe = window.setTimeout(complete, 9000);

    window.addEventListener("hero-video-ready", onVideo);
    window.addEventListener("load", onLoad);
    frame = window.requestAnimationFrame(step);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(markNoVideo);
      window.clearTimeout(failsafe);
      window.removeEventListener("hero-video-ready", onVideo);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`site-intro${leaving ? " is-leaving" : ""}`} aria-hidden="true">
      <div className="site-intro-snow">
        {flakes.map((flake) => (
          <span
            key={flake.id}
            style={{
              left: flake.left,
              animationDelay: flake.delay,
              animationDuration: flake.duration,
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              ["--drift" as string]: flake.drift,
            }}
          />
        ))}
      </div>

      <div className="site-intro-center">
        <Logo className="site-intro-logo" />
        <div className="site-intro-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <div className="site-intro-pct">{progress}%</div>
      </div>
    </div>
  );
}
