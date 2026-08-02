import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    ad: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateAdTitle } from "../actions";

const sessionMock = vi.mocked(getSession);
const findUniqueMock = vi.mocked(prisma.ad.findUnique);
const updateMock = vi.mocked(prisma.ad.update);
const revalidatePathMock = vi.mocked(revalidatePath);

describe("updateAdTitle ownership", () => {
  beforeEach(() => {
    sessionMock.mockResolvedValue({ userId: 11 });
  });

  it("rejects another owner's ad without updating or revalidating", async () => {
    findUniqueMock.mockResolvedValue({
      id: 7,
      title: "Anuncio ajeno",
      description: "Fixture de ownership",
      price: 50.0,
      tags: ["test"],
      likes: 0,
      createdAt: new Date(),
      ownerId: 22,
    });

    const result = await updateAdTitle("7", "Nuevo título");

    expect(result).toEqual({
      ok: false,
      code: 403,
      message: "No tienes permiso para editar este anuncio.",
    });
    expect(updateMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("updates the owner's ad and revalidates list and detail", async () => {
    findUniqueMock.mockResolvedValue({
      id: 7,
      title: "Anuncio propio",
      description: "Fixture de ownership",
      price: 100.0, 
      tags: ["propio"],
      likes: 0,
      createdAt: new Date(),
      ownerId: 11,
    });

    const result = await updateAdTitle("7", "  Título actualizado  ");

    expect(result).toEqual({
      ok: true,
      title: "Título actualizado",
      message: "Título actualizado.",
    });
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { title: "Título actualizado" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/ads/7");
  });
});
