import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";
import { getSiteProjects } from "@/lib/site-content";
import type { Project } from "@/lib/types";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "פרויקטים",
  description: "כל התקנה מתחילה בחלל אמיתי ובאילוצים אמיתיים - מעברים, חשמל, גובה תקרה וקצב עבודה.",
};

const FIELD_FALLBACK = [
  { src: "/projects/field-1.jpg", alt: "מקרר שתייה משולב במדפי עץ" },
  { src: "/projects/field-2.jpg", alt: "מקרר תצוגה שחור רב דלתות" },
  { src: "/projects/field-3.jpg", alt: "חלביית ירקות בסופרמרקט" },
  { src: "/projects/field-4.jpg", alt: "ויטרינות תצוגה למעדנייה" },
];

export default async function ProjectsPage() {
  const projects = await getSiteProjects();
  const [hero, ...rest] = projects;
  const extras = projects
    .flatMap((project) => (project.images ?? []).slice(1).map((src) => ({ src, alt: project.title })))
    .slice(0, 8);
  const fieldShots = extras.length > 0 ? extras : FIELD_FALLBACK;

  return (
    <PageShell active="projects">
      <section className="page-hero">
        <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "פרויקטים" }]} />
        <div className="page-hero-grid">
          <h1>התקנות בשטח</h1>
          <p>כל התקנה מתחילה בחלל אמיתי ובאילוצים אמיתיים - מעברים, חשמל, גובה תקרה וקצב עבודה. כאן ייכנס תיעוד הפרויקטים של קירור דן.</p>
        </div>
      </section>

      {hero ? <HeroProject project={hero} /> : null}

      {rest.map((project, index) => (
        <section key={project.id ?? project.title} className="px" style={{ paddingBottom: "clamp(40px,5vw,80px)" }}>
          <div className={`proj-split${index % 2 === 0 ? "" : " is-rev"}`}>
            {index % 2 === 0 ? <ProjectShot project={project} /> : null}
            <ProjectCopy
              title={project.title}
              text={project.text}
              client={project.client}
              location={project.location}
              equipment={project.equipment}
            />
            {index % 2 === 1 ? <ProjectShot project={project} /> : null}
          </div>
        </section>
      ))}

      {fieldShots.length > 0 ? (
        <section className="suitable">
          <div style={{ padding: "clamp(46px,6vw,96px) var(--pad-x)" }}>
            <h2 style={{ margin: "0 0 clamp(22px,2.8vw,40px)", fontSize: "clamp(22px,2.6vw,38px)", fontWeight: 700, letterSpacing: "-.03em", maxWidth: "22ch" }}>
              תיעוד נוסף מהשטח
            </h2>
            <div className="rel-grid">
              {fieldShots.map((shot) => (
                <div key={shot.src} className="rel-media" style={{ aspectRatio: "4 / 5", background: "#0A0B0C" }}>
                  <SiteImage src={shot.src} alt={shot.alt} fit="cover" sizes="(max-width: 860px) 100vw, 25vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}

function HeroProject({ project }: { project: Project }) {
  return (
    <section style={{ padding: "0 0 clamp(40px,5vw,80px)" }}>
      <div className="proj-big">
        <div style={{ position: "absolute", inset: 0 }}>
          {project.image ? (
            <SiteImage src={project.image} alt={project.title} fit="cover" sizes="100vw" priority />
          ) : null}
        </div>
        <div className="hero-shade" style={{ background: "linear-gradient(180deg,rgba(10,11,12,.35),transparent 45%,rgba(10,11,12,.85))" }} />
        <div style={{ position: "absolute", right: 0, left: 0, bottom: 0, padding: "clamp(20px,3vw,40px) var(--pad-x)" }}>
          <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(24px,3.2vw,50px)", fontWeight: 700, letterSpacing: "-.035em", lineHeight: 1.04, maxWidth: "16ch" }}>
            {project.title}
          </h2>
        </div>
      </div>
      <div
        style={{
          padding: "clamp(20px,2.6vw,36px) var(--pad-x) 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,150px),1fr))",
          gap: "clamp(16px,2.4vw,40px)",
        }}
      >
        <Meta label="לקוח" value={project.client || "—"} />
        <Meta label="מיקום" value={project.location || "—"} />
        {project.type ? <Meta label="סוג התקנה" value={project.type} /> : null}
        <Meta label="ציוד" value={project.equipment || "—"} />
      </div>
    </section>
  );
}

function ProjectShot({ project }: { project: Project }) {
  return (
    <div className="rel-media proj-shot">
      {project.image ? (
        <SiteImage
          src={project.image}
          alt={project.title}
          fit="cover"
          sizes="(max-width: 860px) 100vw, 55vw"
        />
      ) : null}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, color: "var(--mute)" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 500, marginTop: 7 }}>{value}</div>
    </div>
  );
}

function ProjectCopy({
  title,
  text,
  client = "—",
  location = "—",
  equipment,
}: {
  title: string;
  text: string;
  client?: string;
  location?: string;
  equipment: string;
}) {
  return (
    <div>
      <h2 style={{ margin: 0, fontSize: "clamp(22px,2.8vw,42px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.06, maxWidth: "16ch" }}>
        {title}
      </h2>
      {text ? (
        <p className="context-text" style={{ margin: "14px 0 0", maxWidth: "40ch" }}>
          {text}
        </p>
      ) : null}
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 16 }}>
        <Meta label="לקוח" value={client} />
        <Meta label="מיקום" value={location} />
        <Meta label="ציוד" value={equipment || "—"} />
      </div>
    </div>
  );
}
