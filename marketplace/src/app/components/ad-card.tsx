import { AdDto } from "@/lib/ad.types";
import Link from "next/link";
import { LikeButton } from "./like-button";

export function AdCard({
  ad,
  hideTitle = false,
}: {
  ad: AdDto;
  hideTitle?: boolean;
}) {
  return (
    <article className="rounded-lg border border-gray-200 p-4">
      {!hideTitle && (
        <h2 className="text-lg font-bold">
          <Link href={`/ads/${ad.id}`}>
            {ad.title}
          </Link>
        </h2>
      )}
      {process.env.NODE_ENV === "development" && (
        <p className="text-xs text-muted-foreground">
          Anuncio #{ad.id} · owner {ad.ownerId ?? "legacy"}
        </p>
      )}
      <p className="text-sm font-bold">{ad.price} €</p>
      <p className="text-sm text-gray-500">{ad.description}</p>
      <p className="text-xs text-gray-400 mt-1">Tags: {ad.tags.join(", ")}</p>
      <p className="text-sm text-gray-500">
        {ad.createdAt.toLocaleDateString()}
      </p>
      <LikeButton adId={ad.id} likes={ad.likes} />
    </article>
  );
}
