"use client";

import { useState } from "react";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/ui/Reveal";
import { processSteps, projects } from "@/lib/data";

export function HomeProjects() {
  const [index, setIndex] = useState(0);
  const project = projects[index];

  return (
    <section className="proj-spot" id="projects">
      <div className="proj-stage">
        <div style={{ position: "absolute", inset: 0 }}>
          <ImageSlot placeholder={project.placeholder} />
        </div>
        <div
          className="hero-shade"
          style={{
            background: "linear-gradient(180deg,rgba(10,11,12,.5),rgba(10,11,12,.1) 40%,rgba(10,11,12,.85))",
          }}
        />
        <div className="proj-copy">
          <div>
            <h2>{project.title}</h2>
            <p>{project.text}</p>
          </div>
          <div>
            <div className="proj-meta">
              <div>
                <div className="proj-meta-label">לקוח</div>
                <div className="proj-meta-value">-</div>
              </div>
              <div>
                <div className="proj-meta-label">מיקום</div>
                <div className="proj-meta-value">-</div>
              </div>
              <div>
                <div className="proj-meta-label">ציוד</div>
                <div className="proj-meta-value">{project.equipment}</div>
              </div>
            </div>
            <div className="proj-nav">
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.72)", direction: "ltr" }}>
                {index + 1} / {projects.length}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="הקודם"
                  onClick={() => setIndex((i) => (i + projects.length - 1) % projects.length)}
                >
                  →
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="הבא"
                  onClick={() => setIndex((i) => (i + 1) % projects.length)}
                >
                  ←
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="process">
        <Reveal className="process-intro">
          <h2>מהאפיון בשטח ועד היום שהחנות נפתחת</h2>
          <p>חמישה שלבים, כולם אצלנו: אפיון, התאמה, אספקה, התקנה ושירות.</p>
        </Reveal>
        <Reveal className="kd-strip" delay="0.08s">
          {processSteps.map((step) => (
            <figure className="process-card" key={step.title}>
              <div className="process-media" style={{ aspectRatio: step.ratio }}>
                <ImageSlot placeholder={step.placeholder} />
              </div>
              <figcaption>{step.title}</figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
