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

export type AdFixture = {
  adId: number;
  originalTitle: string;
};

export async function getAnaFixture(): Promise<AdFixture> {
  const ana = await prisma.user.findUnique({
    where: { email: DEMO_USERS.A.email },
    select: { id: true },
  });

  if (!ana) {
    throw new Error("Run npm run db:seed before starting Playwright");
  }

  const ad = await prisma.ad.findFirst({
    where: {
      ownerId: ana.id,
      description: FIXTURE_DESCRIPTION,
    },
    orderBy: { id: "asc" },
    select: { id: true, title: true },
  });

  if (!ad) {
    throw new Error("Fixture A is missing; run npm run db:seed");
  }

  return { adId: ad.id, originalTitle: ad.title };
}

export async function restoreAdTitle(
  fixture: AdFixture,
): Promise<void> {
  await prisma.ad.update({
    where: { id: fixture.adId },
    data: { title: fixture.originalTitle },
  });
}

export async function disconnectFixtureDatabase(): Promise<void> {
  await prisma.$disconnect();
}
