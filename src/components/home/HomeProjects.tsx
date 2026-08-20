import { ImageSlot } from "@/components/ui/ImageSlot";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { projects } from "@/lib/data";

export function HomeProjects() {
  return (
    <section className="proj-spot" id="projects">
      <Reveal className="proj-head">
        <h2>פרויקטים מהשטח</h2>
        <p>התקנות בחנויות שעובדות כל יום.</p>
      </Reveal>
      <div className="proj-cards">
        {projects.map((project, index) => (
          <Reveal key={project.title} className="proj-card" delay={`${index * 80}ms`}>
            <article>
              <div className="proj-card-media">
                {project.image ? (
                  <SiteImage src={project.image} alt={project.title} fit="cover" sizes="(max-width: 900px) 100vw, 33vw" />
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
          </Reveal>
        ))}
      </div>
    </section>
  );
}
