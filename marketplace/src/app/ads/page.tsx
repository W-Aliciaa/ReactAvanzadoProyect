import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { AdCard } from "@/app/components/ad-card";

export default async function UserAdsPage() {
  const session = await getSession();

  
  if (!session) {
    redirect("/login?from=/ads");
  }

  
  const myAds = await prisma.ad.findMany({
    where: { ownerId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl p-6 grid gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Anuncios</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona y edita los anuncios que has publicado.
          </p>
        </div>

        <Link
          href="/ads/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Crear nuevo anuncio
        </Link>
      </header>

      <div className="grid gap-4">
        {myAds.map((ad) => (
          <div key={ad.id} className="grid gap-2 border rounded-xl p-4 bg-card">
            <AdCard ad={ad} />
            <div className="flex justify-end gap-2 mt-2">
              <Link
                href={`/ads/${ad.id}`}
                className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground"
              >
                Ver detalle / Editar
              </Link>
            </div>
          </div>
        ))}

        {myAds.length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-xl">
            <p className="text-muted-foreground">No tienes ningún anuncio publicado todavía.</p>
          </div>
        )}
      </div>
    </main>
  );
}