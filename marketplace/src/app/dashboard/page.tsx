import ProjectSection from "../components/project-section";
import { CreateProjectForm } from "../components/forms/create-project-form";
import { getProjectsByFilter } from "@/lib/projects";
import {
  parseProjectQuery,
  projectListHref,
  SearchParamValue,
} from "@/lib/project-query";
import { SearchProjectForm } from "../components/forms/search-project-form";
import { Metadata } from "next";
import Link from "next/link";

type DashboardPageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard de los proyectos",
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const queryParams = await searchParams;
  const input = parseProjectQuery(queryParams);
  const { projects, totalPages } = await getProjectsByFilter(input);

  console.log("dashboardPage: queryParams", { queryParams });

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Proyectos</h1>

      <CreateProjectForm />

      <SearchProjectForm query={input.query} order={input.order} />

      <ProjectSection projects={projects} />

      <nav aria-label="Paginacion de proyectos" className="flex gap-3">
        {input.page > 1 ? (
          <Link href={projectListHref(input, input.page - 1)}>Anterior</Link>
        ) : (
          <span aria-disabled="true">Anterior</span>
        )}

        <span aria-current="page">
          Pagina {input.page} de {totalPages}
        </span>

        {input.page < totalPages ? (
          <Link href={projectListHref(input, input.page + 1)}>Siguiente</Link>
        ) : (
          <span aria-disabled="true">Siguiente</span>
        )}
      </nav>
    </main>
  );
}
