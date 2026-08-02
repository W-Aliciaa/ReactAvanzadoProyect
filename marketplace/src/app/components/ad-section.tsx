import { AdCard } from "./ad-card";
import { AdDto } from "@/lib/ad.types";

export default async function AdSection({
  ads,
}: {
  ads: AdDto[];
}) {
  return (
    <>
      {ads.length === 0 ? (
        <p>No hay anuncios todavía.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </section>
      )}
    </>
  );
}
