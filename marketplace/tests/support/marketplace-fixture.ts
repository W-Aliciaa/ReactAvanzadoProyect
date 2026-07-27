import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { DEMO_USERS } from "../../src/lib/demo-users";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set for Playwright");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const FIXTURE_DESCRIPTION = "Laboratorio de seguridad";

export type ProjectFixture = {
  projectId: number;
  originalTitle: string;
};

export async function getAnaFixture(): Promise<ProjectFixture> {
  const ana = await prisma.user.findUnique({
    where: { email: DEMO_USERS.A.email },
    select: { id: true },
  });

  if (!ana) {
    throw new Error("Run npm run db:seed before starting Playwright");
  }

  const project = await prisma.project.findFirst({
    where: {
      ownerId: ana.id,
      description: FIXTURE_DESCRIPTION,
    },
    orderBy: { id: "asc" },
    select: { id: true, title: true },
  });

  if (!project) {
    throw new Error("Fixture A is missing; run npm run db:seed");
  }

  return { projectId: project.id, originalTitle: project.title };
}

export async function restoreProjectTitle(
  fixture: ProjectFixture,
): Promise<void> {
  await prisma.project.update({
    where: { id: fixture.projectId },
    data: { title: fixture.originalTitle },
  });
}

export async function disconnectFixtureDatabase(): Promise<void> {
  await prisma.$disconnect();
}
