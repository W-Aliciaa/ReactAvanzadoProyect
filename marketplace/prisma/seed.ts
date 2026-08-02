import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { DEMO_USERS } from "../src/lib/demo-users";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});
const FIXTURE_DESCRIPTION = "Laboratorio de seguridad";

async function ensureDemoAd(
  ownerId: number,
  title: string,
): Promise<number> {
  const existing = await prisma.ad.findFirst({
    where: {
      OR: [
        { ownerId, description: FIXTURE_DESCRIPTION },
        { title },
      ],
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.ad.update({
      where: { id: existing.id },
      data: {
        title,
        description: FIXTURE_DESCRIPTION,
        price: 99.99,
        tags: ["demo", "laboratorio"],
        likes: 0,
        ownerId,
      },
    });
    return existing.id;
  }

  const ad = await prisma.ad.create({
    data: {
      title,
      description: FIXTURE_DESCRIPTION,
      price: 99.99,
      tags: ["demo", "laboratorio"],
      ownerId,
    },
    select: { id: true },
  });

  return ad.id;
}

async function main() {
  const fixtures: Array<{
    key: keyof typeof DEMO_USERS;
    userId: number;
    adId: number;
  }> = [];

  for (const key of Object.keys(DEMO_USERS) as Array<keyof typeof DEMO_USERS>) {
    const definition = DEMO_USERS[key];
    const user = await prisma.user.upsert({
      where: { email: definition.email },
      update: { displayName: definition.displayName },
      create: {
        email: definition.email,
        displayName: definition.displayName,
      },
      select: { id: true },
    });
    const adId = await ensureDemoAd(user.id, definition.adTitle);

    fixtures.push({ key, userId: user.id, adId });
  }

  console.table(fixtures);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
