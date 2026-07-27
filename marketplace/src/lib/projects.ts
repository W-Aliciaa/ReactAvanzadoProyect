import prisma from "./prisma";
import { ProjectDto } from "./projects.types";
import { PROJECT_PAGE_SIZE, ProjectQuery } from "./project-query";
import { Prisma } from "@/generated/prisma/client";

export async function getProjectIds(): Promise<number[]> {
  console.log("getProjects");

  const projects = await prisma.project.findMany({
    select: { id: true },
  });
  console.log("db: projects findMany", projects);

  return projects.map((project) => project.id);
}

export type ProjectResult = {
  projects: ProjectDto[];
  totalPages: number;
  total: number;
};

export async function getProjectsByFilter({
  query,
  order,
  page,
}: ProjectQuery): Promise<ProjectResult> {
  console.log("getProjectsByFilter: query, order, page", {
    query,
    order,
    page,
  });

  if (page < 1) {
    throw new Error("El parámetro 'page' no puede ser cero o negativo");
  }

  const where: Prisma.ProjectWhereInput = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const total = await prisma.project.count({ where });
  console.log("getProjectsByFilter: total", total);
  const totalPages = Math.ceil(total / PROJECT_PAGE_SIZE);
  console.log("getProjectsByFilter: totalPages", totalPages);

  if (page > totalPages) {
    return {
      projects: [],
      total,
      totalPages,
    };
  }

  const result = await prisma.project.findMany({
    where,
    orderBy: { createdAt: order },
    skip: (page - 1) * PROJECT_PAGE_SIZE,
    take: PROJECT_PAGE_SIZE,
  });

  return {
    projects: result,
    totalPages,
    total,
  };
}

export async function getProjectById(id: number): Promise<ProjectDto | null> {
  console.log("getProjectById: id", { id });

  const result = await prisma.project.findUnique({ where: { id } });
  return result;
}
