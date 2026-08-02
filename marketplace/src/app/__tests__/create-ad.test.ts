import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    ad: {
      create: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAd } from "../actions";

const sessionMock = vi.mocked(getSession);
const createMock = vi.mocked(prisma.ad.create);
const revalidatePathMock = vi.mocked(revalidatePath);
const redirectMock = vi.mocked(redirect);

function formData(values: Record<string, string>) {
  const data = new FormData();

  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }

  return data;
}

describe("createAd", () => {
  beforeEach(() => {
    sessionMock.mockResolvedValue({ userId: 11 });
    vi.clearAllMocks();
  });

  it("returns validation errors without writing or revalidating", async () => {
    const result = await createAd(
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
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("creates the ad with the session owner and redirects to home", async () => {
    await createAd(
      { status: "idle", message: "", fieldErrors: {} },
      formData({
        title: "  Anuncio de C6  ",
        description: "Una descripción válida para el test.",
        price: "150.50",
        tags: "bici, deporte, montaña"
      }),
    );
  
    expect(createMock).toHaveBeenCalledWith({
      data: {
        title: "Anuncio de C6",
        description: "Una descripción válida para el test.",
        price: 150.5,
        tags: ["bici", "deporte", "montaña"],
        likes: 0,
        ownerId: 11,
      },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/");

    expect(redirectMock).toHaveBeenCalledWith("/");
  });
});
