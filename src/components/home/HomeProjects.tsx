"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { projects } from "@/lib/data";

export function HomeProjects() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const alignCard = useCallback((card: HTMLElement, behavior: ScrollBehavior = "smooth") => {
    const root = scrollerRef.current;
    if (!root) return;
    const endPad = parseFloat(getComputedStyle(root).paddingRight) || 0;
    root.scrollTo({
      left:
        root.scrollLeft +
        card.getBoundingClientRect().right -
        (root.getBoundingClientRect().right - endPad),
      behavior,
    });
  }, []);

  const syncActive = useCallback(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>(".proj-card")];
    const endPad = parseFloat(getComputedStyle(root).paddingRight) || 0;
    const origin = root.getBoundingClientRect().right - endPad;
    let next = 0;
    let closest = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().right - origin);
      if (distance < closest) {
        closest = distance;
        next = index;
      }
    });
    setActive(next);
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || !window.matchMedia("(max-width: 899px)").matches) return;

    const first = root.querySelector<HTMLElement>(".proj-card");
    if (first) alignCard(first, "auto");

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncActive);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    syncActive();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", onScroll);
    };
  }, [alignCard, syncActive]);

  function goTo(index: number) {
    const card = scrollerRef.current?.querySelectorAll<HTMLElement>(".proj-card")[index];
    if (card) alignCard(card);
  }

  return (
    <section className="proj-spot" id="projects">
      <Reveal className="proj-head">
        <h2>פרויקטים מהשטח</h2>
        <p>התקנות בחנויות שעובדות כל יום.</p>
      </Reveal>
      <div className="proj-cards" ref={scrollerRef}>
        {projects.map((project, index) => (
          <article key={project.title} className="proj-card">
            <div className="proj-card-media">
              {project.image ? (
                <SiteImage
                  src={project.image}
                  alt={project.title}
                  fit="cover"
                  sizes="(max-width: 900px) 85vw, 33vw"
                  priority={index === 0}
                />
              ) : (
                <ImageSlot placeholder={project.placeholder} />
              )}
              <div className="proj-card-shade" />
              <div className="proj-card-copy">
                <div className="proj-card-tag">{project.equipment}</div>
                <h3>{project.title}</h3>
                <p>
                  {project.client}
                  {project.location ? ` · ${project.location}` : ""}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="proj-dots" role="tablist" aria-label="פרויקטים">
        {projects.map((project, index) => (
          <button
            key={project.title}
            type="button"
            role="tab"
            aria-label={project.title}
            aria-selected={active === index}
            className={`proj-dot${active === index ? " is-on" : ""}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
