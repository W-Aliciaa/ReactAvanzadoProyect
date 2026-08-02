import prisma from "./prisma";
import { AdDto } from "./ad.types";
import { AD_PAGE_SIZE, AdQuery } from "./ad-query";
import { Prisma } from "@/generated/prisma/client";

export async function getAdIds(): Promise<number[]> {
  console.log("getAds");

  const ads = await prisma.ad.findMany({
    select: { id: true },
  });
  console.log("db: ads findMany", ads);

  return ads.map((ad) => ad.id);
}

export type AdResult = {
  ads: AdDto[];
  totalPages: number;
  total: number;
};

export async function getAdsByFilter({
  query,
  price,
  tag,
  order,
  page,
}: AdQuery): Promise<AdResult> {
  console.log("getAdsByFilter: query, price,tag, order, page", {
    query,
    price,
    tag,
    order,
    page,
  });

  if (page < 1) {
    throw new Error("El parámetro 'page' no puede ser cero o negativo");
  }

  const where: Prisma.AdWhereInput = {
    ...(query
      ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }
    : {}),
    ...(price ? { price: {lte: price}} :{}),
    ...(tag ? {tags:{ has: tag}} : {}),
  };

  const total = await prisma.ad.count({ where });
  console.log("getAdsByFilter: total", total);
  
  const totalPages = Math.ceil(total / AD_PAGE_SIZE);
  console.log("getAdsByFilter: totalPages", totalPages);

  if (page > totalPages && total > 0) {
    return {
      ads: [],
      total,
      totalPages,
    };
  }

  const result = await prisma.ad.findMany({
    where,
    orderBy: { createdAt: order },
    skip: (page - 1) * AD_PAGE_SIZE,
    take: AD_PAGE_SIZE,
  });

  return {
    ads: result,
    totalPages,
    total,
  };
}

export async function getAdById(id: number): Promise<AdDto | null> {
  console.log("getAdById: id", { id });

  const result = await prisma.ad.findUnique({ where: { id } });
  return result;
}
