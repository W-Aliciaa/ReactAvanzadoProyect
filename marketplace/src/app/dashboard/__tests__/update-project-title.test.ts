import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    project: {
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
import { updateProjectTitle } from "../actions";

const sessionMock = vi.mocked(getSession);
const findUniqueMock = vi.mocked(prisma.project.findUnique);
const updateMock = vi.mocked(prisma.project.update);
const revalidatePathMock = vi.mocked(revalidatePath);

describe("updateProjectTitle ownership", () => {
  beforeEach(() => {
    sessionMock.mockResolvedValue({ userId: 11 });
  });

  it("rejects another owner's project without updating or revalidating", async () => {
    findUniqueMock.mockResolvedValue({
      id: 7,
      title: "Proyecto ajeno",
      description: "Fixture de ownership",
      likes: 0,
      createdAt: new Date(),
      ownerId: 22,
    });

    const result = await updateProjectTitle("7", "Nuevo título");

    expect(result).toEqual({
      ok: false,
      code: 403,
      message: "No tienes permiso para editar este proyecto.",
    });
    expect(updateMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("updates the owner's project and revalidates list and detail", async () => {
    findUniqueMock.mockResolvedValue({
      id: 7,
      title: "Proyecto propio",
      description: "Fixture de ownership",
      likes: 0,
      createdAt: new Date(),
      ownerId: 11,
    });

    const result = await updateProjectTitle("7", "  Título actualizado  ");

    expect(result).toEqual({
      ok: true,
      title: "Título actualizado",
      message: "Título actualizado.",
    });
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { title: "Título actualizado" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePathMock).toHaveBeenCalledWith("/dashboard/projects/7");
  });
});
