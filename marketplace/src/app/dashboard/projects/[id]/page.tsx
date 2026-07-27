import { ProjectCard } from "@/app/components/project-card";
import { OptimisticTitleEditor } from "@/app/components/optimistic-title-editor";
import { parseProjectId } from "@/lib/project-query";
import { getProjectById } from "@/lib/projects";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const projectId = parseProjectId(id);

  if (projectId === null) {
    notFound();
  }

  const projectDetail = await getProjectById(projectId);

  if (!projectDetail) {
    notFound();
  }

  return {
    title: projectDetail.title,
    description: projectDetail.description,
  };
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const projectId = parseProjectId(id);
  const query = await searchParams;

  if (
    process.env.NODE_ENV === "development" &&
    query.demoError === "1"
  ) {
    throw new Error("Controlled project detail failure");
  }

  if (projectId === null) {
    notFound();
  }

  const projectDetail = await getProjectById(projectId);

  if (!projectDetail) {
    notFound();
  }

  return (
    <section className="grid gap-6">
      <OptimisticTitleEditor
        confirmedTitle={projectDetail.title}
        labMode={process.env.NODE_ENV === "development"}
        projectId={projectDetail.id}
      />
      <ProjectCard hideTitle project={projectDetail} />
    </section>
  );
}
