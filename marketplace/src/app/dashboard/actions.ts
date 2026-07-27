"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { parseProjectId } from "@/lib/project-query";
import { projectSchema, projectTitleSchema } from "./project-schema";
import { z } from "zod";

export type ProjectActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: {
    title?: string[];
    description?: string[];
  };
};

export async function createProject(
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const session = await getSession();

  if (!session) {
    return {
      status: "error",
      message: "Necesitas una sesión válida para crear un proyecto.",
      fieldErrors: {},
    };
  }

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos indicados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  await prisma.project.create({
    data: {
      ...parsed.data,
      likes: 0,
      ownerId: session.userId,
    },
  });

  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Proyecto creado",
    fieldErrors: {},
  };
}

export type LikeProjectResult =
  | { ok: true }
  | { ok: false; code: 400 | 401 | 404; message: string };

export async function likeProject(
  projectId: number,
): Promise<LikeProjectResult> {
  const session = await getSession();

  if (!session) {
    return { ok: false, code: 401, message: "Necesitas una sesión válida." };
  }

  if (!Number.isSafeInteger(projectId) || projectId <= 0) {
    return { ok: false, code: 400, message: "El ID no es válido." };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });

  if (!project) {
    return { ok: false, code: 404, message: "El proyecto no existe." };
  }

  await prisma.project.update({
    where: { id: project.id },
    data: { likes: { increment: 1 } },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${project.id}`);
  return { ok: true };
}

export type UpdateProjectTitleResult =
  | { ok: true; title: string; message: string }
  | { ok: false; code: 400 | 401 | 403 | 404; message: string };

export async function updateProjectTitle(
  projectIdInput: string,
  titleInput: string,
): Promise<UpdateProjectTitleResult> {
  const session = await getSession();

  if (!session) {
    return { ok: false, code: 401, message: "Necesitas una sesión válida." };
  }

  const projectId = parseProjectId(projectIdInput);
  const title = projectTitleSchema.safeParse(titleInput);

  if (projectId === null || !title.success) {
    return { ok: false, code: 400, message: "Revisa el ID y el título." };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project) {
    return { ok: false, code: 404, message: "El proyecto no existe." };
  }

  if (project.ownerId !== session.userId) {
    return {
      ok: false,
      code: 403,
      message: "No tienes permiso para editar este proyecto.",
    };
  }

  await prisma.project.update({
    where: { id: project.id },
    data: { title: title.data },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${project.id}`);

  return { ok: true, title: title.data, message: "Título actualizado." };
}
