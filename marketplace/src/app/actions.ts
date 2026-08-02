"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { parseAdId } from "@/lib/ad-query";
import { adSchema, adTitleSchema } from "./ad-schema";
import { z } from "zod";
import { redirect } from "next/navigation";


export type AdActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: {
    title?: string[];
    description?: string[];
    price?: string[];
    tags?: string[];
  };
};

export async function createAd(
  _previousState: AdActionState,
  formData: FormData,
): Promise<AdActionState> {
  const session = await getSession();

  if (!session) {
    return {
      status: "error",
      message: "Necesitas una sesión válida para crear un anuncio.",
      fieldErrors: {},
    };
  }

  const parsed = adSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    tags: formData.get("tags"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos indicados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  await prisma.ad.create({
    data: {
      ...parsed.data,
      likes: 0,
      ownerId: session.userId,
    },
  });

  revalidatePath("/");

  redirect("/");
}

export type LikeAdResult =
  | { ok: true }
  | { ok: false; code: 400 | 401 | 404; message: string };

export async function likeAd(
  adId: number,
): Promise<LikeAdResult> {
  const session = await getSession();

  if (!session) {
    return { ok: false, code: 401, message: "Necesitas una sesión válida." };
  }

  if (!Number.isSafeInteger(adId) || adId <= 0) {
    return { ok: false, code: 400, message: "El ID no es válido." };
  }

  const ad = await prisma.ad.findUnique({
    where: { id: adId },
    select: { id: true },
  });

  if (!ad) {
    return { ok: false, code: 404, message: "El anuncio no existe." };
  }

  await prisma.ad.update({
    where: { id: ad.id },
    data: { likes: { increment: 1 } },
  });

  revalidatePath("/");
  revalidatePath(`/ads/${ad.id}`);
  return { ok: true };
}

export type UpdateAdTitleResult =
  | { ok: true; title: string; message: string }
  | { ok: false; code: 400 | 401 | 403 | 404; message: string };

export async function updateAdTitle(
  adIdInput: string,
  titleInput: string,
): Promise<UpdateAdTitleResult> {
  const session = await getSession();

  if (!session) {
    return { ok: false, code: 401, message: "Necesitas una sesión válida." };
  }

  const adId = parseAdId(adIdInput);
  const title = adTitleSchema.safeParse(titleInput);

  if (adId === null || !title.success) {
    return { ok: false, code: 400, message: "Revisa el ID y el título." };
  }

  const ad = await prisma.ad.findUnique({
    where: { id: adId },
    select: { id: true, ownerId: true },
  });

  if (!ad) {
    return { ok: false, code: 404, message: "El anuncio no existe." };
  }

  if (ad.ownerId !== session.userId) {
    return {
      ok: false,
      code: 403,
      message: "No tienes permiso para editar este anuncio.",
    };
  }

  await prisma.ad.update({
    where: { id: ad.id },
    data: { title: title.data },
  });

  revalidatePath("/");
  revalidatePath(`/ads/${ad.id}`);

  return { ok: true, title: title.data, message: "Título actualizado." };
}
