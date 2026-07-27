import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    project: {
      create: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createProject } from "../actions";

const sessionMock = vi.mocked(getSession);
const createMock = vi.mocked(prisma.project.create);
const revalidatePathMock = vi.mocked(revalidatePath);

function formData(values: Record<string, string>) {
  const data = new FormData();

  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }

  return data;
}

describe("createProject", () => {
  beforeEach(() => {
    sessionMock.mockResolvedValue({ userId: 11 });
  });

  it("returns validation errors without writing or revalidating", async () => {
    const result = await createProject(
      { status: "idle", message: "", fieldErrors: {} },
      formData({ title: "x", description: "short" }),
    );

    expect(result).toMatchObject({
      status: "error",
      message: "Revisa los campos indicados.",
    });
    expect(result.fieldErrors.title).toBeDefined();
    expect(result.fieldErrors.description).toBeDefined();
    expect(createMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("creates the project with the session owner and revalidates the dashboard", async () => {
    const result = await createProject(
      { status: "idle", message: "", fieldErrors: {} },
      formData({
        title: "  Proyecto de C6  ",
        description: "Una descripción válida para el test.",
      }),
    );

    expect(result).toEqual({
      status: "success",
      message: "Proyecto creado",
      fieldErrors: {},
    });
    expect(createMock).toHaveBeenCalledWith({
      data: {
        title: "Proyecto de C6",
        description: "Una descripción válida para el test.",
        likes: 0,
        ownerId: 11,
      },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/dashboard");
  });
});
