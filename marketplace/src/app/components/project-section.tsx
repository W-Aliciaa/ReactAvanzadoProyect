import { ProjectCard } from "./project-card";
import { ProjectDto } from "@/lib/projects.types";

export default async function ProjectSection({
  projects,
}: {
  projects: ProjectDto[];
}) {
  return (
    <>
      {projects.length === 0 ? (
        <p>No hay proyectos todavía.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      )}
    </>
  );
}
