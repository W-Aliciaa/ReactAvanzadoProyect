import { ProjectDto } from "@/lib/projects.types";
import Link from "next/link";
import { LikeButton } from "./like-button";

export function ProjectCard({
  project,
  hideTitle = false,
}: {
  project: ProjectDto;
  hideTitle?: boolean;
}) {
  return (
    <article className="rounded-lg border border-gray-200 p-4">
      {!hideTitle && (
        <h2 className="text-lg font-bold">
          <Link href={`/dashboard/projects/${project.id}`}>
            {project.title}
          </Link>
        </h2>
      )}
      {process.env.NODE_ENV === "development" && (
        <p className="text-xs text-muted-foreground">
          Proyecto #{project.id} · owner {project.ownerId ?? "legacy"}
        </p>
      )}
      <p className="text-sm text-gray-500">{project.description}</p>
      <p className="text-sm text-gray-500">
        {project.createdAt.toLocaleDateString()}
      </p>
      <LikeButton projectId={project.id} likes={project.likes} />
    </article>
  );
}
